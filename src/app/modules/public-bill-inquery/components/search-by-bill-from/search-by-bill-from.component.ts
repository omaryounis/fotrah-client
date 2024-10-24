import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

import { FormErrorComponent } from '@shared/components/form-error/form-error.component';

import { ERROR_MESSAGES } from "../../public-bill-inquery.constants";
import { ISearchByBill } from '../../public-bill-inquery.model';

import { PublicBillInqueryService } from '@shared/services/public-bill-inquery/public-bill-inquery.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-by-bill-from',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, ReactiveFormsModule, FormErrorComponent , TranslateModule],
  templateUrl: './search-by-bill-from.component.html',
  styleUrl: './search-by-bill-from.component.scss'
})
export class SearchByBillFromComponent implements OnInit, OnDestroy {
  errorMessages = ERROR_MESSAGES;
  searchByBillForm!: FormGroup;
  searchByBillNumberSubscription!: Subscription;
  searchData: ISearchByBill = {
    billNumber: "",
    identityNumber: "",
  };

  constructor(private formBuilder: FormBuilder, private publicBillInqueryService: PublicBillInqueryService) { }

  get billNumber(): FormGroup {
    return this.searchByBillForm.get("billNumber") as FormGroup;
  }

  get identityNumber(): FormGroup {
    return this.searchByBillForm.get("identityNumber") as FormGroup;
  }

  buildForm() {
    this.searchByBillForm = this.formBuilder.group({
      billNumber: ["", Validators.required],
      identityNumber: ["", Validators.required],
    });
  }

  onSearch() {
    if (this.searchByBillForm.valid) {
      const credentials = this.searchByBillForm.value;
      this.searchByBillNumberSubscription = this.publicBillInqueryService.inqueryBill(credentials, 'byBill').subscribe();
    }
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.searchByBillNumberSubscription?.unsubscribe();
  }
}
