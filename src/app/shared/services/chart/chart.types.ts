export interface IGradientCoord {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
export interface IGradientColor {
  offset: number;
  value: string;
}
export interface IPlugin {
  id: string;
  [key: string]: any;
}
export interface IPluginConfig<T> {
  name: string;
  args: T;
}
export interface ITextStyle {
  font: string;
  fillStyle: string;
}
export interface IDoughnutCenterLabelPlugin {
  id?: string;
  text: string;
  lineheight?: number;
  showDataset?: boolean;
  textStyle: ITextStyle[];
  usePrecentage?: boolean;
}
export interface ILinePointTooltipPlugin {
  id: string;
  pointDataFont?: string;
  rectBackground?: string;
  pointDataTextColor?: string;
}
