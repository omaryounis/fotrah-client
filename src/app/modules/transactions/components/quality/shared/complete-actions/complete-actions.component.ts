import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ButtonModule } from "primeng/button";
import { RadioButtonModule } from "primeng/radiobutton";
import { IQualityMission } from "../../models/quality.model";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { QualityService } from "@shared/services/quality/quality.service";
import { ObjectionStatusEnum } from "@shared/enums/status-types.enum";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "app-complete-actions",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    RadioButtonModule,
    InputTextareaModule
  ],
  templateUrl: "./complete-actions.component.html",
  styleUrl: "./complete-actions.component.scss",
})
export class CompleteActionsComponent {
  @Input() taskData!: IQualityMission;

  @Output() actionSelected = new EventEmitter<string>();
  ObjectionStatusTypes = ObjectionStatusEnum;
  /**
   *
   */

  constructor(private qualityService: QualityService) {}

  submitAction() {
    if (!this.taskData.currentStatus) {
      alert("Please select a decision!");
      return;
    }
    this.actionSelected.emit(this.taskData.currentStatus);
  }
  updateData = () => {
    this.qualityService.rowData.set(this.taskData);
  };
}
