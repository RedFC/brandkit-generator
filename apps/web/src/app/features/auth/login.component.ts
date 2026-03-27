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
      <h2>Login</h2>
      <form class="stack" [formGroup]="form" (ngSubmit)="submit()">
        <input type="email" placeholder="Email" formControlName="email" />
        <input type="password" placeholder="Password" formControlName="password" />
        <button class="btn-primary" [disabled]="loading || form.invalid">{{ loading ? 'Please wait...' : 'Login' }}</button>
      </form>
      <p class="error" *ngIf="error">{{ error }}</p>
      <p><a routerLink="/forgot-password">Forgot password?</a></p>
      <p>New here? <a routerLink="/register">Register</a></p>
    </div>
  `
})
export class LoginComponent {
  loading = false;
  error = "";

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]]
  });

  constructor(private fb: FormBuilder, private auth: AuthFacadeService, private router: Router) {}

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
