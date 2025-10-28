import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselComponent, NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

@Component({
  standalone: true,
  selector: 'app-home-brand',
  templateUrl: './home-brand.component.html',
  styleUrls: ['./home-brand.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzCarouselModule,
    NzGridModule,
    NzPageHeaderModule,
    NzImageModule,
  ],
})
export class HomeBrandComponent implements OnInit, OnChanges {
  // props
  title = 'Top Brands';
  subtitle = '';
  description = '';
  showPrice = false;
  navSpeed = 600;
  categories: any[] = [];
  chunkedCategories: any[][] = [];
  fallback = 'assets/images/placeholder-brand.png'; // Add a fallback image

  @ViewChild('carousel', { static: false }) carousel!: NzCarouselComponent;

  @Input() data: any[] = []; // Fixed the @Input decorator

  private cd = inject(ChangeDetectorRef);
  @Inject(PLATFORM_ID) private platformId: object;
  private isBrowser = false;

  ngOnInit(): void {
    // this.isBrowser = isPlatformBrowser(this.platformId); // Detect browser

    this.chunkCategories();
    if (this.isBrowser) {
      console.log('brands', this.chunkCategories());
    }
    this.cd.detectChanges();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.chunkCategories();
    }
  }

  chunkCategories(): void {
    if (!this.data || this.data.length === 0) return;

    const chunkSize = this.getChunkSize();
    this.chunkedCategories = this.chunkArray(this.data, chunkSize);
    this.cd.detectChanges();
  }

  getChunkSize(): number {
    const width = window.innerWidth;

    // Mobile: 3 items
    if (width <= 480) return 3;

    // Tablet: 5 items
    if (width <= 768) return 5;

    // Desktop: 7 items
    if (width <= 1200) return 7;

    // Large desktop: 8 items
    return 8;
  }

  chunkArray(array: any[], size: number): any[][] {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  prev(): void {
    if (this.carousel) {
      this.carousel.pre();
    }
  }

  next(): void {
    if (this.carousel) {
      this.carousel.next();
    }
  }

  ngOnChanges(): void {
    if (this.isBrowser) {
      this.chunkCategories();
    }
  }

  navigateToCategory(category: any): void {
    // this.categoryService.navigateToCategory(category);
  }
}
