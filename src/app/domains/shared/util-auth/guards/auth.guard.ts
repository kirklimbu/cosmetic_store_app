import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from '../../../../domains/auth/login/state/login.state';
// import { Store } from '@ngxs/store';
// import { AuthState } from 'src/app/domains/auth/login/state/login.state';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard {
//   private router = inject(Router);
//   private readonly authState = inject(AuthState);

//   canActivate() {
//     // const isAuthenticated = this.store.selectSnapshot(
//     //   AuthState.isAuthenticated
//     // );
//     const isAuthenticated = this.authState.isAuthenticated;
//     console.log('auth guard isAuthenticated', isAuthenticated());

//     if (!isAuthenticated()) {
//       this.router.navigate(['/auth/login']);
//       return false;
//     }
//     return true;
//   }
// }

export const AuthGuard = () => {
  const auth = inject(AuthState);
  const router = inject(Router);

  // Wait until auth has been restored from localStorage
  if (!auth.hydrated()) {
    // pause routing until ready
    return new Promise((resolve) => {
      const sub = setInterval(() => {
        if (auth.hydrated()) {
          clearInterval(sub);
          resolve(auth.token() ? true : router.parseUrl('/auth/login'));
        }
      }, 20);
    });
  }
  console.log('auth guard', auth);

  // Once hydrated, check token normally
  return auth.token() ? true : router.parseUrl('/auth/login');
};
