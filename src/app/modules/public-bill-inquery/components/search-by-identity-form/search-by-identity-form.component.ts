import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";

import { FormErrorComponent } from '@shared/components/form-error/form-error.component';

import { ERROR_MESSAGES } from "../../public-bill-inquery.constants";
import { ISearchByIdentity } from '../../public-bill-inquery.model';

import { PublicBillInqueryService } from '@shared/services/public-bill-inquery/public-bill-inquery.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-by-identity-form',
  standalone: true,
  imports: [FormsModule, ButtonModule, DropdownModule, InputTextModule, ReactiveFormsModule, FormErrorComponent ,TranslateModule],
  templateUrl: './search-by-identity-form.component.html',
  styleUrl: './search-by-identity-form.component.scss'
})
export class SearchByIdentityFormComponent implements OnInit, OnDestroy {
  errorMessages = ERROR_MESSAGES;

  identityTypes: any;
  searchByBillForm!: FormGroup;
  getIdentityTypesSubscription!: Subscription;
  searchByBillNumberSubscription!: Subscription;
  searchData: ISearchByIdentity = {
    identityType: null,
    identityNumber: "",
  };

  constructor(private formBuilder: FormBuilder, private publicBillInqueryService: PublicBillInqueryService) { }

  get identityType(): FormGroup {
    return this.searchByBillForm.get("identityType") as FormGroup;
  }

  get identityNumber(): FormGroup {
    return this.searchByBillForm.get("identityNumber") as FormGroup;
  }

  buildForm() {
    this.searchByBillForm = this.formBuilder.group({
      identityType: ["", Validators.required],
      identityNumber: ["", Validators.required],
    });
  }

  onSearch() {
    if (this.searchByBillForm.valid) {
      const credentials = this.searchByBillForm.value;
      this.searchByBillNumberSubscription = this.publicBillInqueryService.inqueryBill(credentials, 'byIdentity').subscribe();
    }
  }

  ngOnInit(): void {
    this.buildForm();
    this.identityTypes = this.publicBillInqueryService.identityTypes;
    this.getIdentityTypesSubscription = this.publicBillInqueryService.getIdentityTypes().subscribe({
      next: (res) => { console.log(res) }
    });
  }

  ngOnDestroy(): void {
    this.searchByBillNumberSubscription?.unsubscribe();
    this.getIdentityTypesSubscription?.unsubscribe();
  }
}
