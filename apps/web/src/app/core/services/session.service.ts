import { Injectable } from "@angular/core";

const ACCESS_KEY = "brandkit_access_token";
const REFRESH_KEY = "brandkit_refresh_token";

@Injectable({ providedIn: "root" })
export class SessionService {
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  getAccessToken(): string {
    return localStorage.getItem(ACCESS_KEY) ?? "";
  }

  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_KEY) ?? "";
  }

  clear(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
