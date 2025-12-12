import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface Template {
  id?: number;
  userId?: number;
  name: string;
  debit: string;
  credit: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private apiUrl = 'http://localhost:5000/api/templates';

  constructor(private http: HttpClient, private authService: AuthService) {}

  async getTemplates(): Promise<Template[]> {
    const user = this.authService.getCurrentUser();
    if (!user) return [];
    return await firstValueFrom(this.http.get<Template[]>(`${this.apiUrl}/${user.id}`));
  }

  async addTemplate(template: Template): Promise<void> {
    const user = this.authService.getCurrentUser();
    if (!user) return;
    await firstValueFrom(this.http.post(this.apiUrl, { ...template, userId: user.id }));
  }

  async deleteTemplate(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }
}