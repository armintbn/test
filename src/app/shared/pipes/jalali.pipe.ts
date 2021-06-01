import { Pipe, PipeTransform } from '@angular/core';
import * as jmoment from 'jalali-moment';
@Pipe({
    name: 'jalali'
})
export class JalaliPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        try {
            if (value) {
                const MomentDate = jmoment(value);
                return MomentDate.format('jYYYY/jM/jD');
            }
            else {
                return value;
            }
        } catch (e) {

        }
    }
}