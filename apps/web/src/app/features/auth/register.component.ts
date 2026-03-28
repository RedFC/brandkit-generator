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
        <h2 class="text-gradient">Create account</h2>
        <p class="auth-subtitle">Start building your brand identity</p>
        <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
          <input placeholder="Full name" formControlName="fullName" />
          <input type="email" placeholder="Email address" formControlName="email" />
          <input type="password" placeholder="Password (min 8 characters)" formControlName="password" />
          <button class="btn-primary" [disabled]="loading || form.invalid">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : 'Create Account' }}
          </button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = "";

  form = this.fb.group({
    fullName: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]]
  });

  constructor(private auth: AuthFacadeService, private router: Router) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = "";

    const payload = this.form.getRawValue() as { fullName: string; email: string; password: string };
    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/otp-verify"], { queryParams: { email: payload.email, purpose: "register" } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? "Registration failed";
      }
    });
  }
}
