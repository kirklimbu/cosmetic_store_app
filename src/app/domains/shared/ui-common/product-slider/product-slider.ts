import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, ViewChild } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { PageHeaderSection } from '../page-header-section/page-header-section';
import { ProductPage } from '../product-page/product-page';

@Component({
  selector: 'app-product-slider',
  imports: [
    CommonModule,
    NzInputModule,
    NzGridModule,
    NzCardModule,
    NzTagModule,
    NzPageHeaderModule,
    NzIconModule,
    NzSkeletonModule,
    // project
    NzCarouselModule,
    PageHeaderSection,
    ProductPage,
  ],
  templateUrl: './product-slider.html',
  styleUrl: './product-slider.scss',
})
export class ProductSlider {
  // props

  data = input<any[]>([]);
  title = input<string>('');
  subtitle = input<string>('');
  description = input<string>('');

  @ViewChild('productSlider', { static: false }) productSlider!: ElementRef;

  scrollLeft() {
    this.productSlider.nativeElement.scrollBy({
      left: -240,
      behavior: 'smooth',
    });
  }

  scrollRight(): void {
    this.productSlider.nativeElement.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  }
}
