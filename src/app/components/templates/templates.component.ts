import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplatesService, Template } from '../../services/templates.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="templates-container">
      <h1>Шаблоны проводок</h1>
      <div class="create-card">
        <h3>Новый шаблон</h3>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Название шаблона</label>
            <input type="text" [(ngModel)]="newTemplate.name" placeholder="Например: Продажа товара" />
          </div>
          <div class="form-group">
            <label>Дебет (Счет)</label>
            <input type="text" [(ngModel)]="newTemplate.debit" placeholder="62" />
          </div>
          <div class="form-group">
            <label>Кредит (Счет)</label>
            <input type="text" [(ngModel)]="newTemplate.credit" placeholder="90.1" />
          </div>
          <div class="form-group full-width">
            <label>Описание</label>
            <input type="text" [(ngModel)]="newTemplate.description" placeholder="Краткое описание проводки" />
          </div>
        </div>
        <button class="btn-save" (click)="saveTemplate()" [disabled]="!newTemplate.name">
          Сохранить шаблон
        </button>
      </div>
      <div class="templates-list" *ngIf="templates.length > 0; else empty">
        <div class="template-item" *ngFor="let t of templates">
          <div class="template-header">
            <h4>{{ t.name }}</h4>
            <button class="btn-delete" (click)="deleteTemplate(t.id!)">🗑️</button>
          </div>
          <div class="accounts">
            <span class="acc debit">Дт {{ t.debit }}</span>
            <span class="arrow">→</span>
            <span class="acc credit">Кт {{ t.credit }}</span>
          </div>
          <p class="desc">{{ t.description }}</p>
        </div>
      </div>
      <ng-template #empty>
        <div class="empty-state">
          <p>У вас пока нет сохранённых шаблонов.</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .templates-container { max-width: 900px; margin: 0 auto; }
    h1 { color: #2c3e50; margin-bottom: 2rem; }
    .create-card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 2rem; }
    .create-card h3 { margin-top: 0; color: #34495e; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .full-width { grid-column: 1 / -1; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #7f8c8d; }
    .form-group input { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .btn-save { background: #27ae60; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; width: 100%; font-size: 1rem; }
    .btn-save:disabled { background: #95a5a6; cursor: not-allowed; }
    .templates-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
    .template-item { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .template-item:hover { transform: translateY(-3px); }
    .template-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .template-header h4 { margin: 0; color: #2c3e50; }
    .btn-delete { background: none; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.6; }
    .btn-delete:hover { opacity: 1; color: #e74c3c; }
    .accounts { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: bold; background: #f8f9fa; padding: 0.5rem; border-radius: 4px; }
    .acc { color: #2c3e50; }
    .desc { color: #7f8c8d; font-size: 0.9rem; margin: 0; }
    .empty-state { text-align: center; color: #95a5a6; padding: 2rem; }
  `]
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  newTemplate: Template = { name: '', debit: '', credit: '', description: '' };

  constructor(private service: TemplatesService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.templates = await this.service.getTemplates();
    this.cdr.detectChanges();
  }

  async saveTemplate() {
    if (!this.newTemplate.name) return;
    await this.service.addTemplate(this.newTemplate);
    this.newTemplate = { name: '', debit: '', credit: '', description: '' }; // Сброс формы
    await this.load();
  }

  async deleteTemplate(id: number) {
    if(confirm('Удалить шаблон?')) {
      await this.service.deleteTemplate(id);
      await this.load();
    }
  }
}