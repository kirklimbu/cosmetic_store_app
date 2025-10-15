import { CommonModule } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
// third-party
import { NzIconModule } from 'ng-zorro-antd/icon';
// import { UserDetailsService } from 'src/app/shared/util-common/userDetails.service';
// import { Logout } from 'src/app/domains/auth/login/state/login.model';
// import { Store } from '@ngxs/store';
import { RouterModule } from '@angular/router';
import { GlobalConstants } from 'src/app/domains/shared/global-constants';
import { UserDetailsService } from 'src/app/domains/shared/util-common/userDetails.service';

@Component({
  selector: 'app-header-top',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // third-party
    NzIconModule,
  ],
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
})
export class HeaderTopComponent implements OnInit {
  url = '/assets/data/pages/company_info.json';
  phoneNo = GlobalConstants.HEAD_OFFICE_PHONE;
  email = GlobalConstants.appEmail;
  facebookUrl = GlobalConstants.facebook;
  isLoggedIn = false;

  private userDetailsService = inject(UserDetailsService);
  private destroyRef = inject(DestroyRef);
  // private store = inject(Store);

  private handler = inject(HttpBackend);

  ngOnInit(): void {
    this.fetchInfo();
  }

  fetchInfo() {
    this.getUserDetails();
  }

  private getUserDetails() {
    // const isAuthenticated = this.userDetailsService.getUserStatus();
    // isAuthenticated
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((res: boolean) => (this.isLoggedIn = res));
  }

  public onLogout() {
    // this.store.dispatch(new Logout());
  }
}
