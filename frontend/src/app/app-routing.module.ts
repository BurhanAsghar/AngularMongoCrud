import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';

const routes: Routes = [
  {path: 'abc', component: EmployeeDashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
