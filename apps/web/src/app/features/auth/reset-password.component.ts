import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AuthFacadeService } from "../../core/services/auth-facade.service";

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="card stack">
      <h2>Reset Password</h2>
      <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
        <input type="email" placeholder="Email" formControlName="email" />
        <input placeholder="6-digit OTP" formControlName="code" />
        <input type="password" placeholder="New password" formControlName="newPassword" />
        <button class="btn-primary" [disabled]="loading || form.invalid">{{ loading ? 'Please wait...' : 'Reset Password' }}</button>
      </form>
      <p class="error" *ngIf="error">{{ error }}</p>
      <p><a routerLink="/login">Back to login</a></p>
    </div>
  `
})
export class ResetPasswordComponent {
  loading = false;
  error = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    code: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
    newPassword: ["", [Validators.required, Validators.minLength(8)]]
  });

  constructor(
    private fb: FormBuilder,
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
