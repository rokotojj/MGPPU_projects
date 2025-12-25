import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { TaxCalculatorService } from '../../services/tax-calculator.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dash-container">
      <div class="header">
        <h1>Панель управления</h1>
        <div class="user-info">
          <span class="welcome-text">Добро пожаловать,</span>
          <span class="user-name">{{ userName }}</span>
          <span class="role-badge" *ngIf="isAdmin">ADMIN</span>
        </div>
      </div>
      <div class="stats-section">
        <div class="stat-box">
          <span class="stat-label">Сохранено расчетов</span>
          <span class="stat-value">{{ calculationsCount }}</span>
        </div>
      </div>

      <h2>Быстрый доступ</h2>
      
      <div class="cards-grid">
        <div class="nav-card" routerLink="/tax-calculator">
          <div class="card-content">
            <h3>Калькулятор налогов</h3>
            <p>Расчет НДС, налогов на прибыль и взносов</p>
          </div>
          <div class="card-footer">
            <span class="link">Перейти &rarr;</span>
          </div>
        </div>

        <div class="nav-card" routerLink="/history">
          <div class="card-content">
            <h3>История операций</h3>
            <p>Архив всех сохраненных расчетов</p>
          </div>
          <div class="card-footer">
            <span class="link">Перейти &rarr;</span>
          </div>
        </div>

        <div class="nav-card admin-card" routerLink="/templates" *ngIf="isAdmin">
          <div class="card-content">
            <div class="badge-admin">Только для Админов</div>
            <h3>Шаблоны проводок</h3>
            <p>Управление глобальными шаблонами системы</p>
          </div>
          <div class="card-footer">
            <span class="link">Перейти &rarr;</span>
          </div>
        </div>

        <div class="nav-card" routerLink="/reference">
          <div class="card-content">
            <h3>Справочник</h3>
            <p>База знаний по налогам и счетам</p>
          </div>
          <div class="card-footer">
            <span class="link">Перейти &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash-container { max-width: 1000px; margin: 0 auto; }
    
    .header { 
      margin-bottom: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1.5rem; 
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
    }
    h1 { margin: 0; font-size: 1.8rem; color: #111827; }
    
    .user-info { display: flex; align-items: center; gap: 0.5rem; font-size: 1rem; }
    .welcome-text { color: #6b7280; }
    .user-name { font-weight: 600; color: #111827; }
    .role-badge { 
      background: #fee2e2; color: #dc2626; font-size: 0.7rem; font-weight: 700; 
      padding: 2px 6px; border-radius: 4px; letter-spacing: 0.5px;
    }

    .stats-section { margin-bottom: 3rem; }
    .stat-box { 
      background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb; 
      display: inline-flex; flex-direction: column; min-width: 220px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .stat-label { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-value { font-size: 2.2rem; font-weight: 700; color: #2563eb; line-height: 1; }

    h2 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #374151; }
    
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    
    .nav-card {
      background: white; border-radius: 12px; border: 1px solid #e5e7eb;
      cursor: pointer; transition: all 0.2s;
      display: flex; flex-direction: column; justify-content: space-between;
      min-height: 180px;
    }
    
    .nav-card:hover { 
      border-color: #2563eb; transform: translateY(-4px); 
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
    }
    
    .card-content { padding: 1.5rem; }
    .card-footer { 
      padding: 1rem 1.5rem; border-top: 1px solid #f3f4f6; 
      background: #f9fafb; border-radius: 0 0 12px 12px; 
    }

    .nav-card h3 { margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1.1rem; font-weight: 600; }
    .nav-card p { color: #6b7280; font-size: 0.95rem; margin: 0; line-height: 1.5; }
    .link { color: #2563eb; font-weight: 500; font-size: 0.9rem; }
    

    .admin-card { border-color: #fca5a5; background: #fff1f2; }
    .admin-card:hover { border-color: #dc2626; }
    .admin-card .card-footer { background: #ffe4e6; border-top-color: #fecdd3; }
    .admin-card .link { color: #dc2626; }
    
    .badge-admin { 
        background: #dc2626; color: white; font-size: 0.7rem; 
        padding: 3px 8px; border-radius: 4px; display: inline-block; 
        margin-bottom: 8px; font-weight: bold; text-transform: uppercase;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName = '';
  calculationsCount = 0;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private taxCalcService: TaxCalculatorService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userName = user.name;
    this.isAdmin = this.authService.isAdmin();


    try {
      const history = await this.taxCalcService.getHistory();
      this.calculationsCount = history.length;
    } catch (e) {
      console.log('Ошибка загрузки статистики');
    }
  }
}