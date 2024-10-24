import { Component, Input, OnInit } from '@angular/core';
import { IExcavationType } from '../../excavation-type.model';
import { TranslateService } from '@ngx-translate/core';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ExcavationTypeFormComponent } from '../excavation-type-form/excavation-type-form.component';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';

@Component({
  selector: 'app-show-excavation-type',
  standalone : true,
  imports : [ButtonModule],
  templateUrl: './show-excavation-type.component.html',
  styleUrls: ['./show-excavation-type.component.scss']
})
export class ShowExcavationTypeComponent implements OnInit {

  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IExcavationType = {
    nameAr: "",
    nameEn : "",
    code: "",
  };

  ref!: DynamicDialogRef;
  excavationRoute: string = ExcavationRoute.EXCAVATIONTYPE;
  title: string = "";

  constructor(private dialogService: DialogService , private translateService: TranslateService,private router :ActivatedRoute) {}
  ngOnInit(): void {
    this.router.params.subscribe(res => 
      {
        this.excavationRoute = res['excavationRoute'];
        this.title = this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'excavation-type.show' : 'excavation-path.show'
      })
   }

  openShowModal(event: any) {
    this.ref = this.dialogService.open(ExcavationTypeFormComponent, {
      header: this.translateService.instant(this.title),
      styleClass: "crud-modal",
      data: {
        excavationTypeData: this.rowData,
        excavationRoute: this.excavationRoute,
        mode: "show",
        footer: {
          showSubmit: false,
          cancelLabel:this.translateService.instant('cancel'),
          onSubmit: () => {
            this.ref?.close();
          },
          onCancel: () => {
            this.ref?.close();
          },
        },
      },
      templates: {
        footer: CrudModalFooterComponent,
      },
    });
  }
}
