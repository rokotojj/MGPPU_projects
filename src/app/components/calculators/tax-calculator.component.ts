import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; 
import { TaxCalculatorService, TaxCalculation } from '../../services/tax-calculator.service';

@Component({
  selector: 'app-tax-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-wrapper">
      <h1 class="page-title">Калькулятор налогов</h1>
      <div class="grid-layout">
        <div class="card input-card">
          <div class="form-group">
            <label>Сумма дохода (₽)</label>
            <input type="number" [(ngModel)]="amount" placeholder="0" (input)="clearResult()"/>
          </div>
          <div class="form-group">
            <label>Ставка налога (%)</label>
            <input type="number" [(ngModel)]="taxRate" placeholder="0" (input)="clearResult()"/>
          </div>
          <div class="quick-select">
            <span class="hint">Быстрый выбор:</span>
            <div class="tags">
              <button *ngFor="let rate of quickRates" (click)="setRate(rate)" 
                [class.active]="taxRate === rate" class="tag">
                {{ rate }}%
              </button>
            </div>
          </div>
          <button class="btn-primary" (click)="calculate()" [disabled]="loading || !amount">
            {{ loading ? 'Расчет...' : 'Рассчитать' }}
          </button>
        </div>
        <div class="card result-card">
          <div *ngIf="result; else emptyState">
            <div class="result-header">
              <span class="date">{{ result.date | date:'dd.MM.yyyy' }}</span>
              <span class="status">Готово</span>
            </div>
            <div class="result-rows">
              <div class="row">
                <span>Доход</span>
                <span class="val">{{ result.amount | number:'1.2-2' }} ₽</span>
              </div>
              <div class="row">
                <span>Ставка</span>
                <span class="val">{{ result.taxRate }}%</span>
              </div>
              <div class="divider"></div>
              <div class="row tax-row">
                <span>Сумма налога</span>
                <span class="val red">{{ result.taxAmount | number:'1.2-2' }} ₽</span>
              </div>
              <div class="row total-row">
                <span>На руки</span>
                <span class="val green">{{ result.totalAmount | number:'1.2-2' }} ₽</span>
              </div>
            </div>
            <button class="btn-outline" (click)="saveCalculation()" [disabled]="saving">
              {{ saving ? 'Сохранение...' : 'Сохранить в историю' }}
            </button>
            
            <div class="success-alert" *ngIf="savedMessage">
              Запись сохранена
            </div>
          </div>
          <ng-template #emptyState>
            <div class="empty-content">
              <p>Введите данные слева и нажмите "Рассчитать"</p>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-wrapper { max-width: 900px; margin: 0 auto; }
    .page-title { font-size: 1.5rem; margin-bottom: 1.5rem; color: #111827; }
    .grid-layout { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 1.5rem; 
      align-items: start;
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #374151; font-size: 0.9rem; }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    input:focus { outline: none; border-color: #2563eb; ring: 2px solid #bfdbfe; }
    .hint { font-size: 0.85rem; color: #6b7280; display: block; margin-bottom: 0.5rem; }
    .tags { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    .tag {
      background: #f3f4f6; border: 1px solid #e5e7eb; padding: 0.3rem 0.8rem;
      border-radius: 4px; font-size: 0.9rem; color: #374151; transition: all 0.2s;
    }
    .tag:hover { background: #e5e7eb; }
    .tag.active { background: #2563eb; color: white; border-color: #2563eb; }
    .btn-primary {
      width: 100%; background: #2563eb; color: white; border: none; padding: 0.85rem;
      border-radius: 6px; font-size: 1rem; font-weight: 500; transition: background 0.2s;
    }
    .btn-primary:hover { background: #1d4ed8; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .btn-outline {
      width: 100%; background: white; border: 1px solid #d1d5db; color: #374151;
      padding: 0.75rem; border-radius: 6px; font-size: 0.95rem; font-weight: 500;
      margin-top: 1.5rem; transition: all 0.2s;
    }
    .btn-outline:hover { border-color: #2563eb; color: #2563eb; }
    .result-header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
    .date { color: #9ca3af; font-size: 0.9rem; }
    .status { background: #dcfce7; color: #166534; padding: 0.1rem 0.5rem; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; }
    .row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.95rem; color: #4b5563; }
    .val { font-weight: 600; color: #111827; }
    .val.red { color: #dc2626; }
    .val.green { color: #059669; }
    .divider { height: 1px; background: #e5e7eb; margin: 1rem 0; }
    .total-row { font-size: 1.1rem; font-weight: 700; color: #111827; margin-top: 0.5rem; }
    .success-alert { margin-top: 1rem; text-align: center; color: #059669; font-size: 0.9rem; }
    .empty-content { 
      text-align: center; color: #9ca3af; padding: 3rem 1rem; 
      display: flex; align-items: center; justify-content: center; height: 100%;
    }
  `]
})
export class TaxCalculatorComponent {
  amount: number = 0;
  taxRate: number = 0;
  result: TaxCalculation | null = null;
  loading = false;
  saving = false;
  savedMessage = false;
  quickRates = [13, 20, 10, 30];

  constructor(private taxCalcService: TaxCalculatorService, private cdr: ChangeDetectorRef) {}

  setRate(rate: number): void { this.taxRate = rate; this.clearResult(); }
  clearResult(): void { this.result = null; this.savedMessage = false; }

  async calculate(): Promise<void> {
    if (!this.amount || !this.taxRate) return;
    this.loading = true;
    try {
      this.result = await this.taxCalcService.calculateTax(this.amount, this.taxRate);
    } catch (error) { console.error(error); } 
    finally { this.loading = false; this.cdr.detectChanges(); }
  }

  async saveCalculation(): Promise<void> {
    if (!this.result) return;
    this.saving = true;
    try {
      await this.taxCalcService.saveCalculation(this.result);
      this.savedMessage = true;
      setTimeout(() => { this.savedMessage = false; this.cdr.detectChanges(); }, 2000);
    } catch (error) { console.error(error); } 
    finally { this.saving = false; this.cdr.detectChanges(); }
  }
}