import { Injectable } from "@angular/core";
import { DynamicDialogRef } from "primeng/dynamicdialog";

import { BehaviorSubject, Subject } from "rxjs";

@Injectable()
export class ModalService {
  constructor() {}

  private isVisableBehaviorSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private isDisableButton: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
 
  
  isVisable$ = this.isVisableBehaviorSubject.asObservable();
  disableButton$ = this.isDisableButton.asObservable();
  private dialogRefs: DynamicDialogRef[] = [];
  openModal( ) {
    // this.dialogRefs.push(ref);
    this.isVisableBehaviorSubject.next(true);
  }
  
  closeModal() {
    this.isVisableBehaviorSubject.next(false);
  }
  closeAll() {
    this.dialogRefs.forEach(ref => ref.close());
    this.dialogRefs = [];
  }
  registerModal( ref? :any) {
    this.dialogRefs.push(ref);
    // this.isVisableBehaviorSubject.next(true);
  }
  updateDisabling(value : boolean) {
    this.isDisableButton.next(value);
  } 
}
