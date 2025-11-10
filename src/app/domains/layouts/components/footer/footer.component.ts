import { CommonModule, DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DatePipe],
})
export class FooterComponent {
  currentYear = signal(new Date().getFullYear());
  appVersion = signal('1.2.t1');
}
