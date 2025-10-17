import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { IProduct } from 'src/app/domains/home/data/model/home.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IStock } from 'src/app/domains/stock/data/model/stock';
import { LazyImgDirective } from '../../directives/lazyImage/lazyImage.directive';

@Component({
  selector: 'app-product-page',
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzImageModule,
    // NzRateModule,
    NzTagModule,
    NzGridModule,
    NzIconModule,
    NzBadgeModule,
    // project
    LazyImgDirective,
  ],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage {
  // props
  data = input<IProduct>();
  gridCols = 2; // Default for mobile

  ngOnInit(): void {
    this.updateGridCols();

    // console.log('products', this.data());
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateGridCols();
  }

  private updateGridCols(): void {
    const width = window.innerWidth;

    if (width < 768) {
      this.gridCols = 5; // Mobile: 2 items
    } else if (width < 1024) {
      this.gridCols = 5; // Tablet: 5 items
    } else {
      this.gridCols = 5; // Desktop: 7 items
    }
  }

  addToCart(product: any): void {
    if (!product.inStock) {
      // this.message.error(`${product.name} is out of stock`);
      return;
    }

    // this.message.success(`Added ${product.name} to cart`);
    // Add your cart logic here
  }

  getDiscountPercentage(product: any): number {
    if (!product.offerPrice) return 0;
    return Math.round(
      ((product.price - product.offerPrice) / product.price) * 100
    );
  }

  getStockStatus(product: any): { text: string; color: string } {
    if (!product.inStock) {
      return { text: 'Out of Stock', color: 'red' };
    } else if (product.stockCount < 10) {
      return { text: `Only ${product.stockCount} left`, color: 'orange' };
    } else {
      return { text: 'In Stock', color: 'green' };
    }
  }
}
