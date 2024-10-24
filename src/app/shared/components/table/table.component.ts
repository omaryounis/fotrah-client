import {
  Component,
  Input,
  Output,
  OnInit,
  TemplateRef,
  ViewChild,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";

import { MenuItem } from "primeng/api";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { MenubarModule } from "primeng/menubar";
import { Menu, MenuModule } from "primeng/menu";

import { ScreenService } from "@shared/services/screen/screen.service";

import { ITableColumn } from "@shared/components/table/table.models";
import { TranslateModule } from "@ngx-translate/core";
import { PaginatorModule } from "primeng/paginator";
import { AppComponent } from "@root/src/app/app.component";
import { CanComponent } from "../can/can.component";
import { StatusTypes } from "@shared/enums/status-types.enum";

@Component({
  selector: "app-table",
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, MenuModule, MenubarModule, TranslateModule ,PaginatorModule ,CanComponent],
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.scss",
})
export class TableComponent implements OnInit {
  @ViewChild("menu") menu!: Menu;

  @Input() actions: MenuItem[] = [];
  @Input() columns: ITableColumn[] = [];
  @Input() dataSource: { [key: string]: any }[] = [];
  @Output() onSelectRow: EventEmitter<any> = new EventEmitter<any>();

  defaultTemplateRef!: TemplateRef<any>;
  showTableCollapseMode: boolean = false;

  constructor(private screenService: ScreenService) { }

  getTemplateRef(
    templates: Record<string, TemplateRef<any>>,
    key: string
  ): TemplateRef<any> {
    return templates[key] || this.defaultTemplateRef;
  }

  toggleActionsMenu($event: MouseEvent) {
    this.menu.toggle($event);
  }

  handleOnSelectRow(item: any) {
    this.onSelectRow.emit(item);
  }

  ngOnInit(): void {
    this.showTableCollapseMode = this.screenService.isScreenBelowThan(888);
  }

  fillItem = (data:any) => {return {...data}};
}
