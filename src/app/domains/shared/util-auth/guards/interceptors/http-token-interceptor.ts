import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
// import { RuntimeTenantService } from '../../../../../core/src/services/run-time-tenant.service';
import { inject } from '@angular/core';
import { AuthState } from '../../../../../domains/auth/login/state/login.state';
import { environment } from '../../../../../../environments/environment';

// If you have a context token defined elsewhere
export const DISABLE_INTERCEPTORS = new HttpContextToken<boolean>(() => false);

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {

  // const store = inject(Store);
  // const token = store.selectSnapshot(AuthState.token);
  const authState = inject(AuthState);
  const token = authState.token(); // store.selectSnapshot(AuthState.token);
  

  const headers: Record<string, string> = {
    UserAgent: environment.UserAgent,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  req = req.clone({ setHeaders: headers });
  return next(req);
};
