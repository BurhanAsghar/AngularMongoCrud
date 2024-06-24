import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit {
  submitted = false;
  employeeForm!: FormGroup;
  employees: any[] = [];
  private baseUrl = 'http://localhost:3000/api/employee';
  currentEmployeeId: string | null = null;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      mobilenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      salary: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });

    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.http.get<any[]>(this.baseUrl).subscribe(
      response => {
        this.employees = response;
      },
      error => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  get f() { return this.employeeForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    const formData = this.employeeForm.value;

    if (this.currentEmployeeId) {
      this.http.put<any>(`${this.baseUrl}/${this.currentEmployeeId}`, formData).subscribe(
        response => {
          const index = this.employees.findIndex(emp => emp._id === this.currentEmployeeId);
          if (index !== -1) {
            this.employees[index] = response;
          }
          this.submitted = false;
          this.currentEmployeeId = null;
          this.employeeForm.reset();
          this.closeModal('editModal');
        },
        error => {
          console.error('Error updating employee:', error);
          this.submitted = false;
        }
      );
    } else {
      this.http.post<any>(this.baseUrl, formData).subscribe(
        response => {
          this.employees.push(response);
          this.submitted = false;
          this.employeeForm.reset();
          this.closeModal('addModal');
        },
        error => {
          console.error('Error adding employee:', error);
          this.submitted = false;
        }
      );
    }
  }

  onDelete(id: string): void {
    this.http.delete<any>(`${this.baseUrl}/${id}`).subscribe(
      () => {
        this.employees = this.employees.filter(emp => emp._id !== id);
      },
      error => {
        console.error('Error deleting employee:', error);
      }
    );
  }

  onEdit(employee: any): void {
    this.currentEmployeeId = employee._id;
    this.employeeForm.patchValue(employee);
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      (modal.querySelector('.btn-close') as HTMLElement)?.click();
    }
  }
}
