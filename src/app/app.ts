import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthState } from './domains/auth/login/state/login.state';
import { NzSpinModule } from 'ng-zorro-antd/spin';
@Component({
  imports: [RouterModule, NzSpinModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'kirana-store';
  readonly authstate = inject(AuthState);
}
