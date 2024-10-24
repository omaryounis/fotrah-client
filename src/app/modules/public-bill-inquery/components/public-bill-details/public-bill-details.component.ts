import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-public-bill-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './public-bill-details.component.html',
  styleUrl: './public-bill-details.component.scss'
})
export class PublicBillDetailsComponent {
  rowData: any;
}
