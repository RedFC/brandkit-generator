import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthFacadeService } from "../services/auth-facade.service";

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthFacadeService);
  const router = inject(Router);

  if (!auth.isAuthenticatedValue()) {
    router.navigate(["/login"]);
    return false;
  }

  return true;
};
