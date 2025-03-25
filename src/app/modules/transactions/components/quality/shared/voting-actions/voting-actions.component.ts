import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component,EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { IQualityMission } from '../../models/quality.model';
import { ObjectionStatusEnum } from '@shared/enums/status-types.enum';
import { QualityService } from '@shared/services/quality/quality.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-voting-actions',
  standalone: true,
  imports: [CommonModule, FormsModule,TranslateModule,ButtonModule,RadioButtonModule,InputTextareaModule],
  templateUrl: './voting-actions.component.html',
  styleUrl: './voting-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotingActionsComponent {
  @Input() taskData!: IQualityMission;

  @Output() actionSelected = new EventEmitter<string>();
  ObjectionStatusTypes = ObjectionStatusEnum
  constructor(private qualityService:QualityService) {
  }

  submitAction() {
    debugger;
    if (!this.taskData.currentStatus) {
      alert("Please select a decision!");
      return;
    }
    this.actionSelected.emit(this.taskData.currentStatus);
  }

  updateData = () => {
    this.qualityService.rowData.set(this.taskData);
  };
  get isCoordinator():boolean {return this.qualityService.isCoordinator()}
}
