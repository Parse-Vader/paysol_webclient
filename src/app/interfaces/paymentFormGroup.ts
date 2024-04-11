import {FormControl} from "@angular/forms";

export interface PaymentFormGroup {
  amount: FormControl<number | null>;
  crypto: FormControl<number | null>;
  reason: FormControl<string | null>;
}
