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
        <h2 class="text-gradient">Verify OTP</h2>
        <p class="auth-subtitle">Enter the 6-digit code sent to your email</p>
        <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
          <input type="email" placeholder="Email address" formControlName="email" />
          <select formControlName="purpose">
            <option value="register">Registration</option>
            <option value="reset">Password Reset</option>
            <option value="login">Login</option>
          </select>
          <input placeholder="000000" formControlName="code" maxlength="6"
                 style="text-align:center;font-size:24px;letter-spacing:12px;font-weight:700;" />
          <button class="btn-primary" [disabled]="loading || form.invalid">
            <span class="spinner" *ngIf="loading"></span>
            {{ loading ? '' : 'Verify Code' }}
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
export class OtpVerifyComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    purpose: ["register" as "register" | "login" | "reset", [Validators.required]],
    code: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  constructor(
    private auth: AuthFacadeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const email = this.route.snapshot.queryParamMap.get("email");
    const purpose = this.route.snapshot.queryParamMap.get("purpose") as "register" | "login" | "reset" | null;
    if (email) this.form.patchValue({ email });
    if (purpose) this.form.patchValue({ purpose });
  }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = "";

    this.auth
      .verifyOtp(this.form.getRawValue() as { email: string; code: string; purpose: "register" | "login" | "reset" })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(["/login"]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message ?? "Verification failed";
        }
      });
  }
}
