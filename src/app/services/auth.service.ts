import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
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
      const token = btoa(`${email}:${password}`);
      localStorage.setItem('auth_token', token);
      const res: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/login`, { email, password })
      );

      const rawUser = res.user || res.User;
      if (!rawUser) return false;

      this.currentUser = {
        id: rawUser.id || rawUser.Id,
        email: rawUser.email || rawUser.Email,
        name: rawUser.name || rawUser.Name,
        role: rawUser.role || rawUser.Role
      };

      localStorage.setItem('user', JSON.stringify(this.currentUser));
      return true;
    } catch (e) {
      console.error(e);
      localStorage.removeItem('auth_token');
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
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean { return !!this.currentUser; }
  getCurrentUser(): User | null { return this.currentUser; }


  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }
}