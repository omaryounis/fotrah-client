import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, TranslateModule ,TooltipModule],
  templateUrl: "./search-bar.component.html",
  styleUrl: "./search-bar.component.scss",
})
export class SearchBarComponent {
  @Input() placeholder: string = "";
  @Input() showSearchAvtions: boolean = false;
  @Input() isInlineSearch: boolean = false;
  @Output() onSearchValueChange: EventEmitter<string> =
    new EventEmitter<string>();
  @Output() onResetSearchValue: EventEmitter<void> = new EventEmitter<void>();
  @Output() onClickSearch: EventEmitter<void> = new EventEmitter<void>();

  @Input() searchValue: string = "";

  triggerOnSearchValueChange() {
    this.onSearchValueChange.emit(this.searchValue);
  }
  position = localStorage.getItem('lang') == 'ar' ? 'left' : 'right'
  triggerSearchBtnClick() {
    this.onClickSearch.emit();
  }

  triggerResetBtnClick() {
    this.searchValue = "";
    this.onResetSearchValue.emit();
  }
  triggerResetData() {
     
    this.searchValue = "";
    this.onSearchValueChange.emit(this.searchValue);
    this.onResetSearchValue.emit();
    this.triggerSearchBtnClick();
  }
}
