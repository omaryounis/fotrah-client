import { Routes } from "@angular/router";

import { PublicBillInqueryComponent } from "./public-bill-inquery.component";
import { PublicBillDetailsComponent } from "./components/public-bill-details/public-bill-details.component";
import { TemplateDownloadComponent } from "./components/template-download/template-download.component";

export const publicBillInqueryRoutes: Routes = [
	{
		path: "bill-inquery",
		component: PublicBillInqueryComponent,
	},
	{
		path: "bill-details",
		component: PublicBillDetailsComponent,
	},
	{
		path: "template-download",
		component: TemplateDownloadComponent,
	}
];