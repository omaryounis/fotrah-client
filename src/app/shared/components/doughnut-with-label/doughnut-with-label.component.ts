import { Component, Input, OnInit } from "@angular/core";

import { ChartModule } from "primeng/chart";

import {
  IPlugin,
  IDoughnutCenterLabelPlugin,
} from "@shared/services/chart/chart.types";

import { ChartService } from "@shared/services/chart/chart.service";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: "app-doughnut-with-label",
  standalone: true,
  imports: [ChartModule],
  templateUrl: "./doughnut-with-label.component.html",
  styleUrl: "./doughnut-with-label.component.scss",
})
export class DoughnutWithLabelComponent implements OnInit {
  @Input() data: any;
  @Input() options: any;
  @Input() plugins: any[] = [];
  @Input() labelPluginArgs!: Partial<IDoughnutCenterLabelPlugin>;

  doughnutLabelPlugin: IPlugin | undefined;
  doughnutLabelOptions: any;

  get allPlugins(): any[] {
    return [this.doughnutLabelPlugin, ...this.plugins];
  }

  constructor(private chartService: ChartService, public langService: LanguageService) { }

  ngOnInit(): void {
    this.doughnutLabelPlugin =
      this.chartService.createPlugin<IDoughnutCenterLabelPlugin>({
        name: "doughnutCenterLabel",
        args: {
          id: "violationCountChartID",
          text: this.langService.getInstantTranslation('total-bills'),
          showDataset: true,
          usePrecentage: false,
          textStyle: [
            {
              font: "900 39.817px Neo Sans W23",
              fillStyle: "rgba(78, 155, 110, 1)",
            },
            {
              font: "400 13.272px Neo Sans Arabic",
              fillStyle: "rgba(77, 77, 77, 1)",
            },
          ],
          ...this.labelPluginArgs,
        },
      });

    this.doughnutLabelOptions = {
      cutout: "88%",
      responsive: true,
      borderRadius: 30,
      borderColor: "transparent",
      maintainAspectRatio: true,
      rotation: 150, // Set the starting point at the 12 o'clock position
      circumference: 280,
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  }
}
