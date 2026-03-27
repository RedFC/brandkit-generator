import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthFacadeService } from "./core/services/auth-facade.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <div class="nav card">
        <div style="display:flex;gap:8px;align-items:center;">
          <strong>BrandKit Generator</strong>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/history" routerLinkActive="active">History</a>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span class="muted" *ngIf="auth.currentUserValue() as user">{{ user.email }}</span>
          <a routerLink="/login" routerLinkActive="active" *ngIf="!auth.isAuthenticatedValue()">Login</a>
          <button class="btn-secondary" *ngIf="auth.isAuthenticatedValue()" (click)="logout()">Logout</button>
        </div>
      </div>

      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  constructor(public auth: AuthFacadeService, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(["/login"])
    });
  }
}
