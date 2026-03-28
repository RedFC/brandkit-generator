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
        <h2 class="text-gradient">Forgot password</h2>
        <p class="auth-subtitle">We'll send a verification code to your email</p>
        <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
          <input type="email" placeholder="Email address" formControlName="email" />
          <button class="btn-primary" [disabled]="loading || form.invalid">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : 'Send Code' }}
          </button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
        <p class="success-msg" *ngIf="message">{{ message }}</p>
        <div class="auth-footer">
          <p><a routerLink="/reset-password">Already have a code? Reset password</a></p>
          <p style="margin-top:8px;"><a routerLink="/login">Back to sign in</a></p>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = "";
  message = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  });

  constructor(private auth: AuthFacadeService, private router: Router) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = "";
    this.message = "";

    const email = this.form.getRawValue().email ?? "";
    this.auth.forgotPassword(email).subscribe({
      next: (response) => {
        this.loading = false;
        this.message = response.message;
        this.router.navigate(["/reset-password"], { queryParams: { email } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? "Failed to send OTP";
      }
    });
  }
}
