import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { CardModule } from "primeng/card";
import { ChartModule } from "primeng/chart";
import { MultiSelectModule } from "primeng/multiselect";

import {
  IPlugin,
  ILinePointTooltipPlugin,
} from "@shared/services/chart/chart.types";
import { IMunicipalOption } from "./commitment-ratio.types";

import { ChartService } from "@shared/services/chart/chart.service";

@Component({
  selector: "app-commitment-ratio",
  standalone: true,
  imports: [CardModule, ChartModule, FormsModule, MultiSelectModule],
  templateUrl: "./commitment-ratio.component.html",
  styleUrl: "./commitment-ratio.component.scss",
})
export class CommitmentRatioComponent implements OnInit {
  commitmentRationPlugin!: IPlugin | undefined;
  commitmentRatioData: any;
  commitmentRationOptions: any;
  cities: IMunicipalOption[] = [];
  selectedCities: IMunicipalOption[] = [];

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.commitmentRationPlugin =
      this.chartService.createPlugin<ILinePointTooltipPlugin>({
        name: "linePointTooltip",
        args: {
          id: "commitmentRatio",
        },
      });
    this.commitmentRatioData = {
      labels: [
        "السلي",
        "الروضة",
        "العريجاء",
        "العريجاء",
        "عرقة",
        "المعذر",
        "الملز",
      ],
      datasets: [
        {
          label: "Solid Part",
          data: [33, 30, 30, 33, 36, 38, 38],
          borderColor: "#99744E",
          borderWidth: 3,
          fill: false,
          tension: 0.32,
          pointRadius: 0,
          segment: {
            borderDash: (ctx: any) => this.down(ctx, [5, 5]),
          },
        },
        {
          label: "Solid Part",
          data: [30, 33, 34, 33, 33, 35, 40],
          borderColor: "#00BC70",
          borderWidth: 3,
          fill: false,
          tension: 0.32,
          pointRadius: 3,
        },
      ],
    };
    this.commitmentRationOptions = {
      responsive: true,
      scaleStepWidth: 5,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "category",
          labels: this.commitmentRatioData.labels,
          border: {
            display: false,
          },
          gridLines: {
            display: false,
          },
          grid: {
            display: false,
          },
          ticks: {
            color: "#6D6D6D",
            font: {
              size: 14,
              family: "Neo Sans Arabic", // Replace 'serif' with the desired font family
            },
          },
        },
        y: {
          min: 25, // Set your desired minimum value
          max: 60,
          ticks: {
            display: false,
            stepSize: 15,
          },
          grid: {
            border: false,
          },
          border: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
        },
      },
    };
    this.cities = [
      { name: "New York", code: "NY" },
      { name: "Rome", code: "RM" },
      { name: "London", code: "LDN" },
      { name: "Istanbul", code: "IST" },
      { name: "Paris", code: "PRS" },
    ];
  }

  down(ctx: any, value: any) {
    return ctx.p0.parsed.y >= 36 ? value : undefined;
  }
}
