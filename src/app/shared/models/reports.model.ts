export interface IBillReportResponse {
  code: string,
  message: string,
  data: {
    totalBillsCount: number,
    paidBillsCount: number,
    unpaidBillsCount: number,
    canceledBillsCount: number,
    totalUnpaidBillsAmount: number,
  }
}

export interface IReportDurration {
  startDate: string;
  endDate: string;
}

export type TReportDurration = IReportDurration | null;
