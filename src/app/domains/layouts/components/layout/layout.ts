import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HeaderTopComponent } from '../header-top/header-top.component';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutModule,
    HeaderComponent,
    FooterComponent,
    HeaderTopComponent,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  onSearch(value: string) {}
}
