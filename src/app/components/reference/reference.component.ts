import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  ReferenceService, 
  TaxReference, 
  AccountingEntry 
} from '../../services/reference.service';

@Component({
  selector: 'app-reference',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Справочник</h1>
      <div class="controls-row">
        <div class="tabs">
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'taxes'"
            (click)="switchTab('taxes')"
          >
            Налоги
          </button>
          <button 
            class="tab-btn"
            [class.active]="activeTab === 'entries'"
            (click)="switchTab('entries')"
          >
            Проводки
          </button>
        </div>
        <div class="search-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text"
            [(ngModel)]="searchQuery"
            (input)="onSearch()"
            placeholder="Поиск по справочнику..."
            class="search-input"
          />
        </div>
      </div>
      <div class="grid-content" *ngIf="activeTab === 'taxes'">
        <div class="ref-card tax-card" *ngFor="let tax of filteredTaxes">
          <div class="card-top">
            <span class="badge-category">{{ tax.category }}</span>
            <span class="badge-rate">{{ tax.rate }}%</span>
          </div>
          <h3>{{ tax.title }}</h3>
          <p class="desc">{{ tax.description }}</p>
        </div>
      </div>
      <div class="list-content" *ngIf="activeTab === 'entries'">
        <div class="ref-card entry-card" *ngFor="let entry of filteredEntries">
          <div class="entry-header">
            <h3 class="code">{{ entry.code }}</h3>
            <span class="entry-desc">{{ entry.description }}</span>
          </div>
          <div class="accounts-visual">
            <div class="acc-box debit">
              <span class="acc-label">Дт</span>
              <span class="acc-val">{{ entry.debit }}</span>
            </div>
            <div class="arrow-wrapper">
              <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <div class="acc-box credit">
              <span class="acc-label">Кт</span>
              <span class="acc-val">{{ entry.credit }}</span>
            </div>
          </div>
          <div class="example-box">
            <strong>Пример:</strong> {{ entry.example }}
          </div>
        </div>
      </div>
      <div class="empty-state" *ngIf="(activeTab === 'taxes' && filteredTaxes.length === 0) || (activeTab === 'entries' && filteredEntries.length === 0)">
        <p>Ничего не найдено</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1000px; margin: 0 auto; }
    .page-title { font-size: 1.8rem; margin-bottom: 2rem; color: #111827; }
    .controls-row { 
      display: flex; justify-content: space-between; align-items: center; 
      margin-bottom: 2rem; gap: 1.5rem; flex-wrap: wrap;
    }
    .tabs { display: flex; background: #e5e7eb; padding: 4px; border-radius: 8px; }
    .tab-btn {
      padding: 0.6rem 1.5rem; border: none; background: transparent;
      border-radius: 6px; font-weight: 500; color: #4b5563; transition: all 0.2s;
    }
    .tab-btn.active { background: white; color: #2563eb; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .search-wrapper { 
      flex-grow: 1; 
      max-width: 400px; 
      position: relative; 
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 1.2rem;
      height: 1.2rem;
      color: #9ca3af;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.8rem; /* Отступ под иконку */
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.95rem;
      background: white;
      transition: all 0.2s;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      box-sizing: border-box;
    }
    .search-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .search-input::placeholder { color: #9ca3af; }
    .grid-content { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .ref-card { background: white; border-radius: 12px; padding: 1.5rem; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); transition: transform 0.2s; }
    .ref-card:hover { transform: translateY(-2px); border-color: #bfdbfe; }
    .card-top { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .badge-category { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; }
    .badge-rate { background: #eff6ff; color: #2563eb; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 700; font-size: 0.9rem; }
    .tax-card h3 { margin: 0 0 0.5rem 0; color: #1f2937; }
    .desc { color: #4b5563; font-size: 0.95rem; line-height: 1.5; margin: 0; }
    .list-content { display: flex; flex-direction: column; gap: 1rem; }
    .entry-card { display: flex; flex-direction: column; gap: 1rem; }
    .entry-header { display: flex; align-items: center; gap: 1rem; }
    .code { margin: 0; background: #1f2937; color: white; padding: 0.3rem 0.8rem; border-radius: 6px; font-size: 1rem; }
    .entry-desc { font-weight: 500; color: #374151; font-size: 1.1rem; }
    .accounts-visual { display: flex; align-items: center; gap: 1.5rem; background: #f9fafb; padding: 1.2rem; border-radius: 8px; border: 1px solid #f3f4f6; }
    .acc-box { display: flex; flex-direction: column; align-items: center; }
    .acc-label { font-size: 0.75rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; }
    .acc-val { font-weight: 700; color: #1f2937; font-size: 1.3rem; }
    .arrow-icon { width: 1.5rem; height: 1.5rem; color: #9ca3af; }
    .example-box { background: #ecfdf5; color: #065f46; padding: 1rem; border-radius: 6px; font-size: 0.95rem; border: 1px solid #a7f3d0; }
    .empty-state { text-align: center; color: #9ca3af; padding: 3rem; background: white; border-radius: 12px; border: 1px solid #e5e7eb; }
  `]
})
export class ReferenceComponent implements OnInit {
  activeTab: 'taxes' | 'entries' = 'taxes';
  searchQuery = '';
  
  allTaxes: TaxReference[] = [];
  allEntries: AccountingEntry[] = [];
  filteredTaxes: TaxReference[] = [];
  filteredEntries: AccountingEntry[] = [];

  constructor(
    private referenceService: ReferenceService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.allTaxes = await this.referenceService.getTaxReferences();
    this.allEntries = await this.referenceService.getAccountingEntries();
    
    this.filteredTaxes = [...this.allTaxes];
    this.filteredEntries = [...this.allEntries];

    this.cdr.detectChanges(); 
  }

  switchTab(tab: 'taxes' | 'entries'): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.filteredTaxes = [...this.allTaxes];
    this.filteredEntries = [...this.allEntries];
  }

  async onSearch(): Promise<void> {
    if (!this.searchQuery.trim()) {
      this.filteredTaxes = [...this.allTaxes];
      this.filteredEntries = [...this.allEntries];
      return;
    }

    const q = this.searchQuery.toLowerCase();

    if (this.activeTab === 'taxes') {
      this.filteredTaxes = this.allTaxes.filter(tax =>
        tax.title.toLowerCase().includes(q) ||
        tax.description.toLowerCase().includes(q) ||
        tax.category.toLowerCase().includes(q)
      );
    } else {
      this.filteredEntries = this.allEntries.filter(entry =>
        entry.code.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.debit.toLowerCase().includes(q) ||
        entry.credit.toLowerCase().includes(q)
      );
    }
  }
}