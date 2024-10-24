import { Component } from '@angular/core';
import { ListRolesComponent } from './components/list-roles/list-roles.component';

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [ListRolesComponent],
  templateUrl: './roles-management.component.html',
  styleUrl: './roles-management.component.scss'
})
export class RolesManagementComponent {

}
