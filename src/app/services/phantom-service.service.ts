import {Injectable, OnInit} from '@angular/core';
import * as bs58 from "bs58";
import * as nacl from "tweetnacl";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import {ConnectData} from "../interfaces/connect.data";
import {AppStaticGlobals} from "../globals/AppStaticGlobals";
import {createTransferCheckedInstruction, getAssociatedTokenAddress} from "@solana/spl-token";
import { App } from '@capacitor/app';
import {ContractHelper} from "../interfaces/contract.enum";
import {CookiesService} from "./cookies.service";


@Injectable({
  providedIn: 'root'
})

export class PhantomServiceService  {
  private _phantom_encryption_public_key: string = "";
  private _nonce: string = "";
  private _data: any;
  private _dappKeyPair = nacl.box.keyPair();
  // private _backToPaysol = `http://test.paysol.me/places/payements`;
  private _backToPaysol = `http://192.168.178.157:8100/auth`;
  private _connection: Connection = new Connection("https://nd-471-114-142.p2pify.com/3a2a6e114f8bead3b52300fad0789a73",
    {wsEndpoint: "wss://ws-nd-471-114-142.p2pify.com/3a2a6e114f8bead3b52300fad0789a73"});

  constructor(private cookieSerive: CookiesService) {
  }

  public decryptPayload = (data: string, nonce: string, sharedSecret: Uint8Array) : any => {
    if (!sharedSecret) throw new Error("missing shared secret");
    if (!data) throw new Error("missing data");
    if (!nonce) throw new Error("missing nonce");
    else{
      try{
        const decryptedData : Uint8Array = nacl.box.open.after(bs58.decode(data), bs58.decode(nonce), sharedSecret)!;
        return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
      }
      catch (e) {
        alert(e);
      }
    }


  };

  public encryptPayload = (payload: any, sharedSecret?: Uint8Array) => {
    if (!sharedSecret) throw new Error("missing shared secret");

    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedSecret
    );

    return [nonce, encryptedPayload];
  };

  public setCookie(){
    const dappKeyPair: nacl.BoxKeyPair = nacl.box.keyPair();
    this.cookieSerive.setNaclBoxKeyPair(
      dappKeyPair
    );
  }

  public getCookie() : nacl.BoxKeyPair | null {
    return this.cookieSerive.getNaclBoxKeyPair();
  }
  public getDapKeyPairSecret(){
    return this.getCookie()!.secretKey;
  }

  private buildUrl (path: string, params: URLSearchParams) {
    return `phantom://v1/${path}?${params.toString()}`;
  };

  public async connect() {
    this.setCookie();
    console.log("stap0");
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.getCookie()!.publicKey), //hier gaat ie fout
      cluster: 'mainnet-beta',
      app_url: 'https://phantom.app/',
      redirect_link: this._backToPaysol,
    });

    console.log("stap1");
    const deepLink = this.buildUrl("connect", params);
    try{
      window.open(deepLink, '_top');
    } catch (ex) {
      console.log(ex);
    }
  }

  public signAndSendTransaction = async (amount: number, pub: string, con: number, nanoId: string) => {

    let transaction;

    switch (con) {
      case 0:
        transaction = await this.createTransferTransaction(amount, pub);
        break;
      default:
        transaction = await this.createSplTokenTransaction(amount,pub,con);
        break;
    }

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(this._phantom_encryption_public_key),
      this.getCookie()!.secretKey
    );
    const connectData: ConnectData = this.decryptPayload(this._data, this._nonce, sharedSecretDapp);

    const payload = {
      session: connectData.session,
      transaction: bs58.encode(serializedTransaction),
    };

    const [nonce, encryptedPayload] = this.encryptPayload(payload, sharedSecretDapp);
    const backToPaysolTransactionStatus: string = `paysol://transactionstatus/amount/${amount}/pub/${pub}/con/${con}/nano/${nanoId}`;

    const paramsTransaction = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.getCookie()!.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: backToPaysolTransactionStatus,
      payload: bs58.encode(encryptedPayload),
    });

    const deeplinkTransaction = this.buildUrl("signAndSendTransaction", paramsTransaction);

    let shouldOpenDeeplink = true;

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive && shouldOpenDeeplink) {
        setTimeout(() => {
          window.open(deeplinkTransaction, '_top');
          shouldOpenDeeplink = false;
        }, 500);
      }
    });

    setTimeout(() => {
      window.open(deeplinkTransaction, '_top');
      shouldOpenDeeplink = false;
    }, 500);

  };

  private createSplTokenTransaction = async (amount: number, pub_receiver: string, contractType: number) => {
    this._phantom_encryption_public_key = AppStaticGlobals.phantom_encryption_public_key;

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(this._phantom_encryption_public_key),
      this.getDapKeyPairSecret()!
    );

    this._data = AppStaticGlobals.Data;
    this._nonce = AppStaticGlobals.Nonce;

    const connectData: ConnectData = this.decryptPayload(this._data, this._nonce, sharedSecretDapp);
    if (!connectData.public_key) throw new Error("Missing public key from user");

    const realFromPublicKey = new PublicKey(connectData.public_key);
    const realToPublicKey = new PublicKey(pub_receiver);

    const mint = new PublicKey(ContractHelper.getContractAddress(contractType))

    const associatedTokenFrom = await getAssociatedTokenAddress(
      mint,
      realFromPublicKey
    );

    const associatedTokenTo = await getAssociatedTokenAddress(
      mint,
      realToPublicKey
    );
    const decimals = ContractHelper.getContractDecimals(contractType);
    const realAmount = amount *  Math.pow(10, decimals);
    let tx = new Transaction().add(
      createTransferCheckedInstruction(
        associatedTokenFrom,
        mint,
        associatedTokenTo,
        realFromPublicKey,
        realAmount ,
         decimals
      )
    );
    tx.feePayer = realFromPublicKey;
    const anyTransaction: any = tx;
    anyTransaction.recentBlockhash = (await this._connection.getLatestBlockhash()).blockhash;

    return tx;
  }

  private createTransferTransaction = async (amount: number, pub_receiver: string) => {

    this._phantom_encryption_public_key = AppStaticGlobals.phantom_encryption_public_key;

    const sharedSecretDapp = nacl.box.before(
      bs58.decode(this._phantom_encryption_public_key),
      this.getDapKeyPairSecret()!
    );


    this._data = AppStaticGlobals.Data;
    this._nonce = AppStaticGlobals.Nonce;

    const connectData: ConnectData = this.decryptPayload(this._data, this._nonce, sharedSecretDapp);

    if (!connectData.public_key) throw new Error("missing public key from user");
    const realFromPublicKey = new PublicKey(connectData.public_key);
    const realToPublicKey = new PublicKey(pub_receiver);

    const balance = await this._connection.getBalance(realFromPublicKey);
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: realFromPublicKey,
        toPubkey: realToPublicKey,
        lamports: LAMPORTS_PER_SOL * amount,
      })
    );
    transaction.feePayer = realFromPublicKey;

    const anyTransaction: any = transaction;
    anyTransaction.recentBlockhash = (await this._connection.getLatestBlockhash()).blockhash;
    return transaction;
  }
}
