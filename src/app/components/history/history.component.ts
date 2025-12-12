import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxCalculatorService, TaxCalculation } from '../../services/tax-calculator.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header-row">
        <h1>📜 История операций</h1>
        <div class="summary-badge">
          <span>Всего налогов:</span>
          <strong>{{ getTotalTax() | number:'1.2-2' }} ₽</strong>
        </div>
      </div>
      <div class="history-grid" *ngIf="calculations.length > 0; else empty">
        <div class="history-card" *ngFor="let calc of calculations">
          <div class="card-left">
            <div class="amount-main">{{ calc.taxAmount | number:'1.2-2' }} ₽</div>
            <div class="sub-info">Налог ({{ calc.taxRate }}%) с суммы {{ calc.amount | number:'1.0-0' }}</div>
          </div>
          <div class="card-right">
            <div class="date-info">{{ formatDate(calc.date) }}</div>
            <button class="btn-icon delete" (click)="deleteCalculation(calc.id!)" title="Удалить">
              🗑️
            </button>
          </div>
        </div>
      </div>
      <ng-template #empty>
        <div class="empty-state">
          <div class="empty-img">📭</div>
          <h3>Пока пусто</h3>
          <p>История ваших расчетов появится здесь</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .container { max-width: 800px; margin: 0 auto; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { margin: 0; font-size: 1.8rem; }
    .summary-badge { background: #dcfce7; color: #166534; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.95rem; }
    .history-grid { display: flex; flex-direction: column; gap: 1rem; }
    .history-card {
      background: white; padding: 1.5rem; border-radius: 12px;
      display: flex; justify-content: space-between; align-items: center;
      box-shadow: var(--shadow-sm); border: 1px solid transparent;
      transition: all 0.2s;
    }
    .history-card:hover { border-color: var(--primary); transform: translateX(5px); }
    .amount-main { font-size: 1.3rem; font-weight: 700; color: var(--text-main); }
    .sub-info { color: var(--secondary); font-size: 0.9rem; margin-top: 0.2rem; }
    .card-right { display: flex; align-items: center; gap: 1.5rem; }
    .date-info { font-size: 0.85rem; color: #94a3b8; background: #f8fafc; padding: 0.3rem 0.6rem; border-radius: 6px; }
    .btn-icon.delete {
      background: #fef2f2; border: none; padding: 0.6rem; border-radius: 8px; font-size: 1.1rem; opacity: 0.7; transition: all 0.2s;
    }
    .btn-icon.delete:hover { opacity: 1; background: #fee2e2; transform: scale(1.1); }
    .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 16px; border: 2px dashed #e2e8f0; }
    .empty-img { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
    .empty-state h3 { margin: 0; color: var(--text-main); }
    .empty-state p { color: var(--secondary); }
  `]
})
export class HistoryComponent implements OnInit {
  calculations: TaxCalculation[] = [];
  constructor(private service: TaxCalculatorService, private cdr: ChangeDetectorRef) {}
  async ngOnInit() { await this.loadHistory(); }
  async loadHistory() {
    this.calculations = await this.service.getHistory();
    this.calculations.sort((a, b) => (b.date && a.date ? new Date(b.date).getTime() - new Date(a.date).getTime() : 0));
    this.cdr.detectChanges();
  }
  getTotalTax() { return this.calculations.reduce((sum, c) => sum + (c.taxAmount || 0), 0); }
  formatDate(d: any) { return d ? new Date(d).toLocaleDateString() : ''; }
  async deleteCalculation(id: number) { if(confirm('Удалить?')) { await this.service.deleteCalculation(id); await this.loadHistory(); } }
}