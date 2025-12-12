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
        <p class="subtitle">Пользователь: {{ userName }}</p>
      </div>
      <div class="stats">
        <div class="stat-box">
          <span class="stat-label">Сохранено расчетов</span>
          <span class="stat-value">{{ calculationsCount }}</span>
        </div>
      </div>
      <h2>Быстрый доступ</h2>
      <div class="cards-grid">
        <div class="nav-card" routerLink="/tax-calculator">
          <h3>Калькулятор налогов</h3>
          <p>Расчет НДС, налогов на прибыль и взносов</p>
          <span class="link">Перейти &rarr;</span>
        </div>
        <div class="nav-card" routerLink="/history">
          <h3>История операций</h3>
          <p>Архив сохраненных расчетов</p>
          <span class="link">Перейти &rarr;</span>
        </div>
        <div class="nav-card" routerLink="/templates">
          <h3>Шаблоны</h3>
          <p>Заготовки бухгалтерских проводок</p>
          <span class="link">Перейти &rarr;</span>
        </div>
        <div class="nav-card" routerLink="/reference">
          <h3>Справочник</h3>
          <p>Полезная информация и коды</p>
          <span class="link">Перейти &rarr;</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash-container { max-width: 1000px; margin: 0 auto; }
    .header { margin-bottom: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 1rem; }
    h1 { margin: 0 0 0.5rem 0; font-size: 1.8rem; color: #111827; }
    .subtitle { color: #6b7280; margin: 0; }
    .stats { margin-bottom: 3rem; }
    .stat-box { 
      background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb; 
      display: inline-flex; flex-direction: column; min-width: 200px;
    }
    .stat-label { font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem; }
    .stat-value { font-size: 2rem; font-weight: 700; color: #2563eb; }
    h2 { font-size: 1.2rem; margin-bottom: 1.5rem; color: #374151; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .nav-card {
      background: white; padding: 1.5rem; border-radius: 8px; border: 1px solid #e5e7eb;
      cursor: pointer; transition: all 0.2s;
    }
    .nav-card:hover { border-color: #2563eb; transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .nav-card h3 { margin: 0 0 0.5rem 0; color: #1f2937; font-size: 1.1rem; }
    .nav-card p { color: #6b7280; font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.4; }
    .link { color: #2563eb; font-weight: 500; font-size: 0.9rem; }
  `]
})
export class DashboardComponent implements OnInit {
  userName = '';
  calculationsCount = 0;
  constructor(private authService: AuthService, private taxCalcService: TaxCalculatorService, private router: Router) {}
  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) { this.router.navigate(['/login']); return; }
    this.userName = user.name;
    const history = await this.taxCalcService.getHistory();
    this.calculationsCount = history.length;
  }
}