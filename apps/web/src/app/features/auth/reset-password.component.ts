import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthFacadeService } from "../../core/services/auth-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card fade-in">
        <h2 class="text-gradient">Reset password</h2>
        <p class="auth-subtitle">Enter your OTP code and new password</p>
        <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
          <input type="email" placeholder="Email address" formControlName="email" />
          <input placeholder="6-digit OTP code" formControlName="code" maxlength="6" />
          <input type="password" placeholder="New password (min 8 characters)" formControlName="newPassword" />
          <button class="btn-primary" [disabled]="loading || form.invalid">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : 'Reset Password' }}
          </button>
        </form>
        <p class="error" *ngIf="error">{{ error }}</p>
        <div class="auth-footer">
          <p><a routerLink="/login">Back to sign in</a></p>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    code: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
    newPassword: ["", [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private auth: AuthFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const email = this.route.snapshot.queryParamMap.get("email");
    if (email) this.form.patchValue({ email });
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = "";

    this.auth
      .resetPassword(this.form.getRawValue() as { email: string; code: string; newPassword: string })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(["/login"]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? "Reset password failed";
        }
      });
  }
}
