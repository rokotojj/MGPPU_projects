import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Регистрация</h2>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Имя</label>
            <input type="text" [(ngModel)]="name" name="name" placeholder="Иван Иванов" required />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="example@mail.com" required />
          </div>
          
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Минимум 8 символов" required />
            <span class="hint">Буквы и цифры, мин. 8 символов</span>
          </div>
          
          <div class="form-group">
            <label>Подтвердите пароль</label>
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Повторите пароль" required />
          </div>

          <div class="error-alert" *ngIf="errorMessage">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="success-alert" *ngIf="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit" class="btn-primary full-width" [disabled]="loading">
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
    .auth-wrapper { display: flex; justify-content: center; align-items: center; min-height: 80vh; background: #f3f4f6; }
    .auth-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 100%; max-width: 400px; border: 1px solid #e5e7eb; }
    h2 { text-align: center; color: #111827; margin-top: 0; margin-bottom: 2rem; font-size: 1.8rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500; font-size: 0.9rem; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; box-sizing: border-box; }
    input:focus { outline: none; border-color: #2563eb; ring: 2px solid #bfdbfe; }
    .hint { font-size: 0.8rem; color: #6b7280; margin-top: 0.3rem; display: block; }
    
    .btn-primary { width: 100%; background: #2563eb; color: white; border: none; padding: 0.85rem; border-radius: 6px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.2s; margin-top: 1rem; }
    .btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }
    .btn-primary:hover:not(:disabled) { background: #1d4ed8; }
    
    .auth-footer { margin-top: 1.5rem; text-align: center; font-size: 0.95rem; color: #4b5563; }
    .auth-footer a { color: #2563eb; text-decoration: none; font-weight: 500; }
    
    .error-alert { background: #fef2f2; color: #dc2626; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; border: 1px solid #fecaca; }
    .success-alert { background: #dcfce7; color: #166534; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; font-size: 0.9rem; border: 1px solid #bbf7d0; }
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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }

    this.loading = true;

    try {
      const success = await this.authService.register(this.email, this.password, this.name);

      if (success) {
        this.successMessage = 'Успешно! Переходим на вход...';
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } else {
        this.errorMessage = 'Ошибка регистрации. Возможно, email занят или пароль слишком простой.';
      }
    } catch (error) {
      this.errorMessage = 'Ошибка соединения с сервером.';
      console.error(error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}