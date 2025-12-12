import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; 
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('user');
    if (saved) this.currentUser = JSON.parse(saved);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password })
      );
      console.log('ОТВЕТ ВХОДА:', res);
      const rawUser = res.user || res.User;

      if (!rawUser) return false;

      this.currentUser = {
        id: rawUser.id || rawUser.Id,
        email: rawUser.email || rawUser.Email,
        name: rawUser.name || rawUser.Name
      };

      console.log('Пользователь сохранен:', this.currentUser);
      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async register(email: string, password: string, name: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post(`${this.apiUrl}/register`, { email, password, name })
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean { return !!this.currentUser; }
  getCurrentUser(): User | null { return this.currentUser; }
}