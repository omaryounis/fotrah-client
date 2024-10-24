import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { TasksService } from "@shared/services/tasks/tasks.service";
import { TranslateModule } from "@ngx-translate/core";
import { ITask } from "../../../tasks/tasks.model";
import { TFormModes } from "../../orders.model";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "app-task-order",
  standalone: true,
  imports: [FormsModule, DropdownModule, InputTextModule, RadioButtonModule, TranslateModule ,InputTextareaModule],
  templateUrl: "./order-form.component.html",
  styleUrl: "./order-form.component.scss",
})
export class OrderFormComponent implements OnInit {
  mode: TFormModes = "show";
  details = [{ key: '', value: '' }];
  attachments: any[] = [];
  orderData: ITask = {
    id: "",
    type: "",
    date: "",
    sender: "",
    requestTypeId: 0
  };

  constructor(private dynamicDialogConfig: DynamicDialogConfig, private taskService: TasksService) { }

  ngOnInit(): void {
     
    this.orderData = this.dynamicDialogConfig.data.orderData;
    this.mode = this.dynamicDialogConfig.data.mode;
    this.updateData();
    this.taskService.getTaskDetails(parseInt(this.orderData.id!)).subscribe(
      res => {
        this.details = res.data.details;
        this.attachments = res.data.attachments;
      }
    );

   
  }
  downloadFile(base64File: string, fileName: string) {
    const mimeType = this.getMimeType(base64File); // Optionally detect mime type
    const byteCharacters = atob(base64File);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType.mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
   
  }

  // Optional: Function to detect MIME type
  getMimeType(base64: string): any {

    if (base64.charAt(0) === '/') return { mimeType: 'image/jpeg', ext: '.jpeg' };
    else if (base64.charAt(0) === 'i') return { mimeType: 'image/png', ext: '.png' };
    else if (base64.charAt(0) === 'R') return { mimeType: 'application/pdf', ext: '.pdf' };
    else return { mimeType: 'application/pdf', ext: '.pdf' }
    // Add more conditions as needed
    // return mimeType;
  }
  updateData = () => this.taskService.rowData.set(this.orderData)
}
  // const linkSource = `data:${mimeType.mimeType};base64,${base64File}`;
    // window.open(linkSource, '_blank');
    // const downloadLink = document.createElement('a');
    // downloadLink.href = linkSource;
    // downloadLink.target = "_blank"
    // downloadLink.download = (fileName ?? 'file') + mimeType.ext;
    // downloadLink.click();