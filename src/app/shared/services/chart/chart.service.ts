import { Injectable } from "@angular/core";

import {
  IPlugin,
  IPluginConfig,
  IGradientColor,
  IGradientCoord,
  IDoughnutCenterLabelPlugin,
  ILinePointTooltipPlugin,
} from "./chart.types";

@Injectable({
  providedIn: "root",
})
export class ChartService {
  constructor() {}

  public createGradientColor(
    colors: IGradientColor[],
    coord: IGradientCoord = { x0: 0, y0: 0, x1: 0, y1: 400 }
  ): CanvasGradient | string {
    const ctx = document.createElement("canvas").getContext("2d");
    if (ctx) {
      const gradient = ctx.createLinearGradient(
        coord.x0,
        coord.y0,
        coord.x1,
        coord.y1
      );
      colors.forEach((color) => {
        gradient.addColorStop(color.offset, color.value);
      });
      return gradient;
    } else {
      throw new Error("Canvas not supported");
    }
  }

  public createPlugin<T>(config: IPluginConfig<T>): IPlugin | undefined {
    switch (config.name) {
      case "doughnutCenterLabel":
        return this.createDoughnutCenterLabelPlugin(
          config.args as IDoughnutCenterLabelPlugin
        );
      case "linePointTooltip":
        return this.createLinePointTooltipPlugin<T>(
          config.args as ILinePointTooltipPlugin
        );
      default:
        return;
    }
  }

  private createDoughnutCenterLabelPlugin<T>(
    pluginArgs: IDoughnutCenterLabelPlugin
  ): IPlugin {
    const plugin: IPlugin = {
      id: pluginArgs.id || pluginArgs.text,
      beforeDatasetsDraw(chart: any, args: any, pluginOptions: any) {
        const { ctx, data } = chart;
        ctx.save();

        const xCoor = chart.getDatasetMeta(0).data[0].x;
        const yCoor = chart.getDatasetMeta(0).data[0].y;
        const innerWidth = chart.getDatasetMeta(0).data[0].innerRadius;
        const lineheight = pluginArgs["lineheight"] || 30;
        const text = pluginArgs["showDataset"]
          ? `${data.datasets[0].data[0]}${
              pluginArgs["usePrecentage"] ? "%" : ""
            }\n${pluginArgs["text"]}`
          : pluginArgs["text"];
        const lines = text.split("\n");
        const textStyle = pluginArgs["textStyle"];

        ctx.textAlign = "center";
        ctx.textBaseLine = "top";
        ctx.beginPath();
        ctx.fillStyle = "rgba(78, 155, 110, 0.1)";
        ctx.arc(xCoor, yCoor, innerWidth, 0, 2 * Math.PI);
        ctx.fill();

        for (var i = 0; i < lines.length; i++) {
          ctx.font = textStyle[i].font;
          ctx.fillStyle = textStyle[i].fillStyle;
          ctx.fillText(lines[i], xCoor, yCoor + i * lineheight);
        }
      },
    };
    return plugin;
  }

  private createLinePointTooltipPlugin<T>(
    pluginArgs: ILinePointTooltipPlugin
  ): IPlugin {
    const plugin: IPlugin = {
      id: pluginArgs.id,
      afterDraw(chart: any, args: any, options: any) {
        const { ctx } = chart;
        const width = (chart.getDatasetMeta(1).dataset._chart.width * 4) / 100;
        ctx.save();

        chart.getDatasetMeta(1).data.forEach((dataPoint: any, index: any) => {
          const { x, y } = dataPoint.tooltipPosition();
          const tooltipText = `${chart.data.datasets[1].data[index]}`;
          const textWidth = ctx.measureText(tooltipText).width;
          const rectX = x - (width * 40) / 100;
          const rectY = y - (width * 148) / 100;
          const rectWidth = textWidth + 10;
          const rectHeight = textWidth + 10;
          const textX = rectX + (textWidth + 22) / 2;
          const textY = rectY + (textWidth + 17) / 2;
          const rectBorderRadius = (width * 25) / 100;

          ctx.fillStyle = pluginArgs["rectBackground"] || "rgb(78, 155, 110)";
          ctx.beginPath();
          ctx.roundRect(rectX, rectY, rectWidth, rectHeight, rectBorderRadius);
          ctx.fill();

          ctx.font = pluginArgs["pointDataFont"] || "10px Inter";
          ctx.fillStyle = pluginArgs["pointDataTextColor"] || "white";
          ctx.fillText(tooltipText, textX, textY);
          ctx.restore();
        });
      },
    };

    return plugin;
  }
}
