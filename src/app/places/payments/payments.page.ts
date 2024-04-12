import { Component, ViewChild, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {PayComponent} from "./pay/pay.component";
import { HttpClient } from '@angular/common/http';
import { TransactionModel } from 'src/app/interfaces/transaction.model';
import {AppStaticGlobals} from "../../globals/AppStaticGlobals";
import {Contract} from "../../interfaces/contract.enum";
import type { IonModal } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import {
  CurrencyPrice,
  ModalItem,
  RealtimeServerPriceService,
  vsToken
} from "../../services/realtime-server-price.service";

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  @ViewChild('modal', { static: true }) modal!: IonModal;
  selectedValuta: string = 'USD';
  transactions: TransactionModel[] = [];
  modalItems : ModalItem[] = []


  protected readonly Contract = Contract;

  constructor(private _modalCtrl: ModalController, private http: HttpClient,private animationCtrl: AnimationController, private realtime: RealtimeServerPriceService) { }

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

  setPrices(){
    this.modalItems = this.realtime.getUpdatedListOfModalItems();
  }
  handleChange(e: any) {
    this.selectedValuta = e.detail.value;
    this.modalItems = this.realtime.changePrices(this.selectedValuta);
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
        item: item,
        selectedValuta: this.selectedValuta
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    });
  }

  protected readonly CurrencyPrice = CurrencyPrice;
  protected readonly vsToken = vsToken;
}
