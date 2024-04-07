import {Component, Input, ViewChild} from '@angular/core';
import {PhantomServiceService} from "../../../../services/phantom-service.service";
import {ModalController, Platform} from "@ionic/angular";
import {QRCodeComponent} from "angularx-qrcode";
import {TransactionModel} from "../../../../interfaces/transaction.model";
import {AppStaticGlobals} from "../../../../globals/AppStaticGlobals";
import {ClientRequestService} from "../../../../services/client-request.service";
import {nanoid} from "nanoid";
import {Contract} from "../../../../interfaces/contract.enum";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  @Input() amount: number = 0;
  @Input() reason: string = '';
  @Input() contract: Contract = Contract.SOL;

  @ViewChild('qrcode', { static: false }) qrcodeElement!: QRCodeComponent;
  public pubkey : string = '';
  public link : string = '';
  public deepLink : string = '';
  public uniqueId : string = '';
  public idUrl : string = '';
  constructor(private _phantom: PhantomServiceService,
              private _modalCtrl: ModalController,
              private _clientRequest: ClientRequestService,
              private platform: Platform
              ) {}

  async ngOnInit(){
    this.pubkey = AppStaticGlobals.pub_key;
    this.generateUniqueId();
    this.deepLink = this.createDeeplink();
    this.idUrl = this.transferIdUrl();
  }

  public async shareUrl() {
    if (this.platform.is('mobile')) {
      this.webLink();
      await navigator.share({
        title: 'Paysol Transaction',
        text: 'New Paysol transaction!\n',
        url: this.idUrl,
      });
    } else {
      alert('Please use your mobile browser!');
    }
    await this.dismissModal();
  }
  public async CreateTransaction() {
    await this._phantom.signAndSendTransaction(this.amount, this.pubkey.toString(), this.contract, this.uniqueId);
    await this.dismissModal();
  }

  protected webLink (){
    const newTransaction: TransactionModel = {
      id: this.uniqueId,
      contract: this.contract,
      message: this.reason,
      amount: this.amount,
      sender: '',
      receiver: this.pubkey,
      finalised: false,
      deepLink: this.createDeeplink(),
      date: new Date()
    };
    this._clientRequest.transferDeepLinkUrl(newTransaction);
  }

  protected generateUniqueId(): void {
    this.uniqueId = nanoid();
  }
  protected createDeeplink = (): string => `paysol://solsendertransaction/amount/${this.amount}/pub/${this.pubkey.toString()}/con/${this.contract}/nano/${this.uniqueId}`;
  protected transferIdUrl = (): string => `https://paysol.me/tx?data=${this.uniqueId}`;

  async dismissModal() {
    await this._modalCtrl.dismiss(null, 'confirm');
  }
}
