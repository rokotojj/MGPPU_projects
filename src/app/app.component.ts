import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="layout">
      <nav class="navbar" *ngIf="isAuthenticated()">
        <div class="container nav-content">
          <div class="brand" routerLink="/dashboard">
            Buha<span class="brand-accent">Pro</span>
          </div>
          <ul class="menu">
            <li><a routerLink="/dashboard" routerLinkActive="active">Главная</a></li>
            <li><a routerLink="/tax-calculator" routerLinkActive="active">Калькулятор</a></li>
            <li><a routerLink="/history" routerLinkActive="active">История</a></li>
            <li><a routerLink="/templates" routerLinkActive="active">Шаблоны</a></li>
            <li><a routerLink="/reference" routerLinkActive="active">Справочник</a></li>
          </ul>
          <button (click)="logout()" class="btn-logout">Выход</button>
        </div>
      </nav>
      <main class="container main-container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .navbar { background: white; border-bottom: 1px solid #e5e7eb; height: 60px; display: flex; align-items: center; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 1rem; }
    .nav-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
    .brand { font-weight: 700; font-size: 1.25rem; color: #1f2937; cursor: pointer; text-transform: uppercase; letter-spacing: 0.5px; }
    .brand-accent { color: #2563eb; }
    .menu { display: flex; list-style: none; gap: 2rem; margin: 0; padding: 0; }
    .menu a { text-decoration: none; color: #4b5563; font-size: 0.95rem; font-weight: 500; transition: color 0.2s; }
    .menu a:hover, .menu a.active { color: #2563eb; }
    .btn-logout { background: transparent; border: 1px solid #d1d5db; padding: 0.4rem 1rem; border-radius: 6px; color: #374151; font-size: 0.9rem; transition: all 0.2s; }
    .btn-logout:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
    .main-container { padding-top: 2rem; padding-bottom: 2rem; }
  `]
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}
  isAuthenticated(): boolean { return this.authService.isAuthenticated(); }
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}