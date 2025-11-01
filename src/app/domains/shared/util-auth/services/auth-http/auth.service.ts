import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/domains/user-profile/data/model/user-profile.model';
import { environment } from '../../../../../../environments/environment';
import { ICustomResponse } from '../../../models/CustomResponse.model';
import { ILoginResponseDto, UserModel } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUserSignal = signal<UserModel | undefined>(undefined);
  private tokenSignal = signal<string | null>(null);
  private hydrated = signal(false);

  private router = inject(Router);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  // ✅ Expose signals
  currentUser = computed(() => this.currentUserSignal());
  token = computed(() => this.tokenSignal());
  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor() {
    this.restoreSession();
  }

  // TODO: OVER ALL TEST GARNE ULD GARNU AGADI
  // Getter/setter for current user
  // get currentUser() {
  //   return this.currentUserSignal();
  // }

  // set currentUser(user: UserModel | undefined) {
  //   this.currentUserSignal.set(user);
  // }

  // ✅ Restore auth from storage before app starts
  private restoreSession() {
    if (!isPlatformBrowser(this.platformId)) {
      this.hydrated.set(true);
      return;
    }

    const data = localStorage.getItem('Auth');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        this.tokenSignal.set(parsed.token);
        this.currentUserSignal.set(new UserModel(parsed.user));
      } catch {
        localStorage.removeItem('Auth');
      }
    }
    this.hydrated.set(true);
  }

  private saveAuth(user: UserModel, token: string) {
    this.currentUserSignal.set(user);
    this.tokenSignal.set(token);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('Auth', JSON.stringify({ user, token }));
    }
  }

  private clearAuth() {
    this.currentUserSignal.set(undefined);
    this.tokenSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('Auth');
    }
  }

  login(username: string, password: string): Observable<ILoginResponseDto> {
    return this.http.post<ILoginResponseDto>(`${this.apiUrl}user/login`, {
      username,
      password,
    });
  }

  logout(userId: number): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}user/logout?userId=${userId}`,
      {}
    );
  }

  registration(user: UserModel): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}user/registration/save`,
      user
    );
  }

  forgetPassword(password: any): Observable<ICustomResponse> {
    return this.http.post<ICustomResponse>(
      `${this.apiUrl}auth/user/password/change/save`,
      password
    );
  }

  private refreshPage(): void {
    const currentRoute = this.router.url;
    const [url, query] = currentRoute.split('?');
    const id = query?.split('=')[1];

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url], id ? { queryParams: { id } } : undefined);
    });
  }

  getUserProfile(): Observable<IUser> {
    return this.http.get<IUser>(`${this.apiUrl}auth/user/profile`);
  }

  // ✅ Guards use this to wait for hydration before redirect
  waitUntilHydrated(): Promise<boolean> {
    return new Promise((resolve) => {
      const t = setInterval(() => {
        if (this.hydrated()) {
          clearInterval(t);
          resolve(true);
        }
      }, 10);
    });
  }
}
