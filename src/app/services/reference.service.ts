import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface TaxReference {
  id: number;
  title: string;
  description: string;
  rate: number;
  category: string;
}

export interface AccountingEntry {
  id: number;
  code: string;
  debit: string;
  credit: string;
  description: string;
  example: string;
}

@Injectable({ providedIn: 'root' })
export class ReferenceService {
  private apiUrl = 'http://localhost:5000/api/reference';

  constructor(private http: HttpClient) {}

  async getTaxReferences(): Promise<TaxReference[]> {
    return await firstValueFrom(
      this.http.get<TaxReference[]>(`${this.apiUrl}/taxes`)
    );
  }

  async getAccountingEntries(): Promise<AccountingEntry[]> {
    return await firstValueFrom(
      this.http.get<AccountingEntry[]>(`${this.apiUrl}/entries`)
    );
  }

  async search(query: string, type: 'tax' | 'entry'): Promise<TaxReference[] | AccountingEntry[]> {
    if (type === 'tax') {
      const all = await this.getTaxReferences();
      return all.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
    } else {
      const all = await this.getAccountingEntries();
      return all.filter(e => e.description.toLowerCase().includes(query.toLowerCase()));
    }
  }
}