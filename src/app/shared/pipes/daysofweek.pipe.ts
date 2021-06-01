import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysofweek'
})
export class DaysofweekPipe implements PipeTransform {

  transform(value: string) {

    switch (value) {
      case ('Sat') :
       return ' شنبه ';
       case ('Sun') :
       return ' یکشنبه ';
       case ('Mon') :
       return ' دوشنبه ';
       case ('Tue') :
       return ' سه شنبه ';
       case ('Wed') :
       return ' چهارشنبه ';
       case ('Thur') :
       return ' پنجشنبه ';
       case ('Fri') :
       return ' جمعه ';       
    }
     return ' -- ';
  }

}
