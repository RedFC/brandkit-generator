import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthFacadeService } from "../../core/services/auth-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card stack">
      <h2>Forgot Password</h2>
      <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
        <input type="email" placeholder="Email" formControlName="email" />
        <button class="btn-primary" [disabled]="loading || form.invalid">{{ loading ? 'Please wait...' : 'Send OTP' }}</button>
      </form>
      <p class="error" *ngIf="error">{{ error }}</p>
      <p class="muted" *ngIf="message">{{ message }}</p>
      <p><a routerLink="/reset-password">Already have OTP? Reset password</a></p>
    </div>
  `
})
export class ForgotPasswordComponent {
  loading = false;
  error = "";
  message = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder, private auth: AuthFacadeService, private router: Router) {}

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
