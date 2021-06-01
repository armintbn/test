import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngxDeleteConfirm]'
})
export class DeleteConfirmDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }

}
