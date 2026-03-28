import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthFacadeService } from "../../core/services/auth-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card fade-in">
        <h2 class="text-gradient">Welcome back</h2>
        <p class="auth-subtitle">Sign in to your BrandKit account</p>
        <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
          <input type="email" placeholder="Email address" formControlName="email" />
          <input type="password" placeholder="Password" formControlName="password" />
          <button class="btn-primary" [disabled]="loading || form.invalid">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : 'Sign In' }}
          </button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
        <div class="auth-footer">
          <p><a routerLink="/forgot-password">Forgot password?</a></p>
          <p style="margin-top:8px;">New here? <a routerLink="/register">Create account</a></p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]]
  });

  constructor(private auth: AuthFacadeService, private router: Router) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = "";

    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? "Login failed";
      }
    });
  }
}
