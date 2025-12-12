import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Регистрация</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Имя</label>
            <input 
              type="text" 
              [(ngModel)]="name" 
              name="name"
              placeholder="Иван Иванов"
              required
            />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="example@mail.com"
              required
            />
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div class="form-group">
            <label>Подтвердите пароль</label>
            <input 
              type="password" 
              [(ngModel)]="confirmPassword" 
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          <div class="success-message" *ngIf="successMessage">
            {{ successMessage }}
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>Уже есть аккаунт? <a routerLink="/login">Войти</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 100px);
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    .auth-card h2 {
      margin-top: 0;
      margin-bottom: 1.5rem;
      text-align: center;
      color: #2c3e50;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }
    .form-group input:focus {
      outline: none;
      border-color: #3498db;
    }
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }
    .btn-primary:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
    .auth-footer {
      margin-top: 1.5rem;
      text-align: center;
    }
    .auth-footer a {
      color: #3498db;
      text-decoration: none;
    }
    .auth-footer a:hover {
      text-decoration: underline;
    }
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #fadbd8;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .success-message {
      color: #27ae60;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #d5f4e6;
      border-radius: 4px;
      font-size: 0.9rem;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Пароль должен содержать минимум 6 символов';
      return;
    }

    this.loading = true;

    try {
      const success = await this.authService.register(this.email, this.password, this.name);
      if (success) {
        this.successMessage = 'Регистрация успешна! Перенаправление на страницу входа...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.errorMessage = 'Ошибка при регистрации';
      }
    } catch (error) {
      this.errorMessage = 'Произошла ошибка при регистрации';
    } finally {
      this.loading = false;
    }
  }
}