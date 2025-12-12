import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface TaxCalculation {
  id?: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  date?: Date;
  description?: string;
  userId?: number;
}

@Injectable({ providedIn: 'root' })
export class TaxCalculatorService {
  private apiUrl = 'http://localhost:5000/api/tax';

  constructor(private http: HttpClient, private authService: AuthService) {}

  async calculateTax(amount: number, taxRate: number): Promise<TaxCalculation> {
    const data: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/calculate`, { amount, taxRate })
    );

    return {
      amount: data.amount || data.Amount,
      taxRate: data.taxRate || data.TaxRate,
      taxAmount: data.taxAmount || data.TaxAmount,
      totalAmount: data.totalAmount || data.TotalAmount,
      date: data.date || data.Date,
      id: data.id || data.Id
    };
  }

  async saveCalculation(calc: TaxCalculation): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) return;

    await firstValueFrom(
        this.http.post(`${this.apiUrl}/history`, { ...calc, userId: user.id })
    );
  }

  async getHistory(): Promise<TaxCalculation[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return [];
    
    const list: any[] = await firstValueFrom(
        this.http.get<any[]>(`${this.apiUrl}/history/${user.id}`)
    );

    return list.map(item => ({
      id: item.id || item.Id,
      amount: item.amount || item.Amount,
      taxRate: item.taxRate || item.TaxRate,
      taxAmount: item.taxAmount || item.TaxAmount,
      totalAmount: item.totalAmount || item.TotalAmount,
      date: item.date || item.Date,
      userId: item.userId || item.UserId
    }));
  }

  async deleteCalculation(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/history/${id}`));
  }
}