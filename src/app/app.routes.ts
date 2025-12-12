import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TaxCalculatorComponent } from './components/calculators/tax-calculator.component';
import { HistoryComponent } from './components/history/history.component';
import { ReferenceComponent } from './components/reference/reference.component';
import { TemplatesComponent } from './components/templates/templates.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tax-calculator', component: TaxCalculatorComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'reference', component: ReferenceComponent },
  { path: 'templates', component: TemplatesComponent }
];