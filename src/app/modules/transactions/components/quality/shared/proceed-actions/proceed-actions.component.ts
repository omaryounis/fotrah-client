import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IQualityMission } from "../../models/quality.model";
import { TranslateModule } from "@ngx-translate/core";
import { ObjectionStatusEnum } from "@shared/enums/status-types.enum";
import { ButtonModule } from "primeng/button";
import { RadioButtonModule } from "primeng/radiobutton";
import { QualityService } from "@shared/services/quality/quality.service";

@Component({
  selector: "app-proceed-actions",
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule,ButtonModule,RadioButtonModule],
  templateUrl: "./proceed-actions.component.html",
  styleUrl: "./proceed-actions.component.scss",
})
export class ProceedActionsComponent {
  @Input() taskData!: IQualityMission;

  @Output() actionSelected = new EventEmitter<string>();
  ObjectionStatusTypes = ObjectionStatusEnum
  /**
   *
   */
  constructor(private readonly qualityService:QualityService) {
    
  }
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
