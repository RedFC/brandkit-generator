import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthFacadeService } from "../../core/services/auth-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card stack">
      <h2>Verify OTP</h2>
      <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
        <input type="email" placeholder="Email" formControlName="email" />
        <select formControlName="purpose">
          <option value="register">Register</option>
          <option value="reset">Reset Password</option>
          <option value="login">Login</option>
        </select>
        <input placeholder="6-digit OTP" formControlName="code" />
        <button class="btn-primary" [disabled]="loading || form.invalid">{{ loading ? 'Please wait...' : 'Verify OTP' }}</button>
      </form>
      <p class="error" *ngIf="error">{{ error }}</p>
      <p><a routerLink="/login">Go to login</a></p>
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
