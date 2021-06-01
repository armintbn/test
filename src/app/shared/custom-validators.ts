import {AbstractControl, ValidationErrors} from '@angular/forms';
export class CustomValidators {

}
export function nationalityCode(control: AbstractControl): ValidationErrors | null {
  if (control.value) {
      let value = control.value;
      if (value) {
          const length = value.toString().length;
          if (length < 8 || parseInt(value, 10) === 0) {
              return { nationalityCode: true };
          }

          if (
              control.value === '0000000000' || control.value === '1111111111' ||
              control.value === '2222222222' || control.value === '3333333333' ||
              control.value === '4444444444' || control.value === '5555555555' ||
              control.value === '6666666666' || control.value === '7777777777' ||
              control.value === '8888888888' || control.value === '9999999999'
          ) {
              return { nationalityCode: true };
          }

          value = ('0000' + value).substr(length + 4 - 10);
          if (parseInt(value.substr(3, 6), 10) === 0) {
              return { nationalityCode: true };
          }
          const c = parseInt(value.substr(9, 1), 10);
          let s = 0;
          for (let i = 0; i < 9; i++) {
              s += parseInt(value.substr(i, 1), 10) * (10 - i);
          }
          s = s % 11;
          if (!((s < 2 && c === s) || (s >= 2 && c === (11 - s)))) {
              return { nationalityCode: true };
          }
      }
  }
}
