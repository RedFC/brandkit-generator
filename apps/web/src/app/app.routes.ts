import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./features/auth/login.component";
import { RegisterComponent } from "./features/auth/register.component";
import { OtpVerifyComponent } from "./features/auth/otp-verify.component";
import { ForgotPasswordComponent } from "./features/auth/forgot-password.component";
import { ResetPasswordComponent } from "./features/auth/reset-password.component";
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { WorkspaceComponent } from "./features/workspace/workspace.component";
import { HistoryComponent } from "./features/history/history.component";

export const routes: Routes = [
  { path: "", redirectTo: "dashboard", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "otp-verify", component: OtpVerifyComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "reset-password", component: ResetPasswordComponent },
  { path: "dashboard", canActivate: [authGuard], component: DashboardComponent },
  { path: "workspace/:projectId", canActivate: [authGuard], component: WorkspaceComponent },
  { path: "history", canActivate: [authGuard], component: HistoryComponent },
  { path: "**", redirectTo: "dashboard" }
];
