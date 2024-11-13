export interface ITableColumn {
  text?: string;
  hidden?: boolean;
  dataIndex?: string;
  tdTemplate?: string;
  tdClassList?: string[];
  showOnExpandedRow?: boolean;
  thTemplate?: "actionTemplate";
  condition?: (item: any) => boolean;
}
