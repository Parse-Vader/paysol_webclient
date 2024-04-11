import {Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TransactionComponent} from './transaction/transaction.component';
import {PaymentFormGroup} from "../../../interfaces/paymentFormGroup";
import {Contract} from "../../../interfaces/contract.enum";
import {CurrencyPrice, ModalItem, RealtimeServerPriceService} from "../../../services/realtime-server-price.service";

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss'],
})
export class PayComponent  implements OnInit {
  @Input() item: ModalItem = { text: 'Solana', iconUrl: 'assets/icon/solanaLogoMark.svg', contract: Contract.SOL, priceId: CurrencyPrice.SOL, price: null };
  @Input() selectedValuta: string = '';

  protected isDisabled: boolean = false;
  public isCalculating: boolean = false;

  public paymentFormGroup: FormGroup<PaymentFormGroup>;
  constructor(private _modalCtrl: ModalController,
              private toastController: ToastController,
              private realtimePrice: RealtimeServerPriceService
  ) {
    this.paymentFormGroup = new FormGroup<PaymentFormGroup>({
      amount: new FormControl<number | null>( null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0.0001)]
      }),
      crypto: new FormControl<number | null>( null, {
        updateOn: 'blur',
        validators: [ Validators.min(0.0001)]
      }),
      reason: new FormControl<string | null>('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(4), Validators.maxLength(100)]
      })
    });
  }

  ngOnInit() {
    this.paymentFormGroup.valueChanges.subscribe(() => {
      if (!this.isCalculating) {
        this.isDisabled = !this.paymentFormGroup.valid;
      }
    });

    this.paymentFormGroup.controls.crypto.valueChanges.subscribe(() => {
      if (!this.isCalculating) {
        this.isCalculating = true;
        this.calculateVsTokenInAmount(this.paymentFormGroup.controls.crypto.value!);
        this.isCalculating = false;
      }
    });

    this.paymentFormGroup.controls.amount.valueChanges.subscribe(() => {
      if (!this.isCalculating) {
        this.isCalculating = true;
        this.calculateAmountInVsToken(this.paymentFormGroup.controls.amount.value!);
        this.isCalculating = false;
      }
    });
  }

  public async calculateAmountInVsToken(amount: number) {
    const priceOfOneUnitOfReceivable = await this.realtimePrice.getTokenPrice(this.item.priceId, this.getStringVsToken(this.selectedValuta));
    const priceOfCalculation = priceOfOneUnitOfReceivable * amount;
    this.isCalculating = true;
    this.paymentFormGroup.controls.crypto.setValue(priceOfCalculation);
    this.isCalculating = false;
  }

  public async calculateVsTokenInAmount(amount: number) {
    const priceOfOneUnitOfReceivable = await this.realtimePrice.getTokenPrice(this.item.priceId, this.getStringVsToken(this.selectedValuta));
    const priceOfCalculation = amount / priceOfOneUnitOfReceivable;
    this.isCalculating = true;
    this.paymentFormGroup.controls.amount.setValue(priceOfCalculation);
    this.isCalculating = false;
  }

  getStringVsToken(valuta: string){
    switch (valuta) {
      case 'USD':
        return 'USDC';
      case 'EUR':
        return 'EURC'
      case 'SOL':
        return 'SOL'
      case 'BTC':
        return 'WBTC';
      case 'ETH':
        return 'ETH';
      default:
        return '';
    }
  }

  public handleChange(e: any) {
    this.selectedValuta = e.detail.value;
    this.calculateVsTokenInAmount(this.paymentFormGroup.controls.crypto.value!);

  }

  public cancel():void {
    this._modalCtrl.dismiss(null, 'cancel');
  }

  private dismissModal(role: string = 'cancel'): void {
    this._modalCtrl.dismiss(null, role);
  }

  protected confirm(): void {
    if (this.paymentFormGroup.valid) {
      this.dismissModal('confirm');
      this.transactionModal();
    } else {
      this.presentToast('top').then(() => {
        this.isDisabled = true;
      });
    }
  }

  private async transactionModal() {
    const modalTransaction = await this._modalCtrl.create({
      component: TransactionComponent,
      componentProps: {
        amount: this.paymentFormGroup.controls.amount.value,
        reason: this.paymentFormGroup.controls.reason.value,
        contract: this.item.contract
      }
    });
    modalTransaction.present();

    modalTransaction.onDidDismiss().then(resultData => {
      if (resultData.role === 'confirm') {
        this.dismissModal('confirm');
      }
    });
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Please enter the form details to proceed.',
      duration: 2000,
      position: position,
    });

    await toast.present();
  }
}
