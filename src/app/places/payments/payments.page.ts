import { Component, ViewChild, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PayComponent} from "./pay/pay.component";
import { HttpClient } from '@angular/common/http';
import { TransactionModel } from 'src/app/interfaces/transaction.model';
import {AppStaticGlobals} from "../../globals/AppStaticGlobals";
import {Contract} from "../../interfaces/contract.enum";
import type { IonModal } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';

export interface ModalItem {
  text: string;
  iconUrl: string;
  contract: Contract
}
@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  @ViewChild('modal', { static: true }) modal!: IonModal;
  transactions: TransactionModel[] = [];
  modalItems : ModalItem[] = [
    { text: 'Solana', iconUrl: 'assets/icon/solanaLogoMark.svg', contract: Contract.SOL },
    { text: 'USDC', iconUrl: 'assets/icon/usd-coin-usdc-logo.svg', contract: Contract.USDC },
    { text: 'EURC', iconUrl: 'assets/icon/euro.svg', contract: Contract.EURC },
    { text: 'USDT', iconUrl: 'assets/icon/usdt.svg', contract: Contract.USDT },
    { text: 'MYRO', iconUrl: 'assets/icon/myro.svg', contract: Contract.MYRO },
    { text: 'JUP', iconUrl: 'assets/icon/jup.svg', contract: Contract.JUP },
    { text: 'RNDR', iconUrl: 'assets/icon/rndr.svg', contract: Contract.RNDR },
    { text: 'PYTH', iconUrl: 'assets/icon/pyth.svg', contract: Contract.PYTH },
    { text: 'RAY', iconUrl: 'assets/icon/ray.svg', contract: Contract.RAY },
    { text: 'ORCA', iconUrl: 'assets/icon/orca.svg', contract: Contract.ORCA },
    { text: 'WIF', iconUrl: 'assets/icon/wif.svg', contract: Contract.WIF },
    { text: 'ROLLBIT', iconUrl: 'assets/icon/rollbit.svg', contract: Contract.ROLLBIT },
    { text: 'JITOSTAKEDSOL', iconUrl: 'assets/icon/jito.svg', contract: Contract.JITOSTAKEDSOL },
    { text: 'WBTC', iconUrl: 'assets/icon/wbtc.svg', contract: Contract.WBTC },
    { text: 'SLERF', iconUrl: 'assets/icon/slerf.svg', contract: Contract.SLERF },
    { text: 'BONK', iconUrl: 'assets/icon/bonk.svg', contract: Contract.BONK },
    { text: 'MARINADESTAKEDSOL', iconUrl: 'assets/icon/msol.svg', contract: Contract.MARINADESTAKEDSOL }
  ];

  protected readonly Contract = Contract;

  constructor(private _modalCtrl: ModalController, private http: HttpClient,private animationCtrl: AnimationController) { }

  async ngOnInit() {
    var pubkey = AppStaticGlobals.pub_key;
    const newTransactions = this.http.get<TransactionModel[]>(`https://paysol.me/api/transaction/${pubkey}`);
    newTransactions.subscribe((data) => {
      if (data.length > 0) {
        this.transactions = [...this.transactions, ...data];
      }
    });

    this.initModal();
  }
  initModal(){
    const enterAnimation = (baseEl: HTMLElement) => {
      const root : ShadowRoot = baseEl.shadowRoot!;

      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(root.querySelector('.modal-wrapper')!)
        .keyframes([
          { offset: 0, opacity: '0', transform: 'scale(0)' },
          { offset: 1, opacity: '0.99', transform: 'scale(1)' },
        ]);

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: HTMLElement) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    this.modal.enterAnimation = enterAnimation;
    this.modal.leaveAnimation = leaveAnimation;
  }

  closeModal() {
    this.modal.dismiss();
  }
  getContractType(contractValue: number): string {
    return Contract[contractValue];
  }

  public cancel():void {
    this._modalCtrl.dismiss(null, 'cancel');
  }

  public onSelectedCoinClick( item: ModalItem): void {
    this._modalCtrl.create({
      component: PayComponent,
      componentProps: {
        item: item
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }
}
