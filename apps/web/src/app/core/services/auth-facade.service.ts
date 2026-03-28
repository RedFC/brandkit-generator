import { Injectable, signal } from "@angular/core";
import { Observable, map, tap } from "rxjs";
import { ApiClientService } from "./api-client.service";
import { SessionService } from "./session.service";
import type { LoginResponse, UserPublic } from "../../shared/models/auth.models";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: "root" })
export class AuthFacadeService {
  private currentUser = signal<UserPublic | null>(null);
  private authenticated = signal(false);

  constructor(private api: ApiClientService, private session: SessionService) {
    this.authenticated.set(!!this.session.getAccessToken());
  }

  currentUserValue(): UserPublic | null {
    return this.currentUser();
  }

  isAuthenticatedValue(): boolean {
    return this.authenticated();
  }

  register(payload: {
    fullName: string;
    email: string;
    password: string;
  }): Observable<ApiEnvelope<unknown>> {
    return this.api.post<ApiEnvelope<unknown>>("/auth/register", payload);
  }

  verifyOtp(payload: {
    email: string;
    code: string;
    purpose: "register" | "login" | "reset";
  }): Observable<ApiEnvelope<{ user: UserPublic }>> {
    return this.api.post<ApiEnvelope<{ user: UserPublic }>>("/auth/verify-otp", payload).pipe(
      tap((response) => {
        this.currentUser.set(response.data.user);
      })
    );
  }

  login(payload: { email: string; password: string }): Observable<UserPublic> {
    return this.api.post<ApiEnvelope<LoginResponse>>("/auth/login", payload).pipe(
      tap((response) => {
        this.session.setTokens(response.data.accessToken, response.data.refreshToken);
        this.currentUser.set(response.data.user);
        this.authenticated.set(true);
      }),
      map((response) => response.data.user)
    );
  }

  forgotPassword(email: string): Observable<ApiEnvelope<unknown>> {
    return this.api.post<ApiEnvelope<unknown>>("/auth/forgot-password", { email });
  }

  resetPassword(payload: {
    email: string;
    code: string;
    newPassword: string;
  }): Observable<ApiEnvelope<unknown>> {
    return this.api.post<ApiEnvelope<unknown>>("/auth/reset-password", payload);
  }

  logout(): Observable<ApiEnvelope<unknown>> {
    const refreshToken = this.session.getRefreshToken();
    return this.api.post<ApiEnvelope<unknown>>("/auth/logout", { refreshToken }).pipe(
      tap(() => {
        this.session.clear();
        this.authenticated.set(false);
        this.currentUser.set(null);
      })
    );
  }
}
