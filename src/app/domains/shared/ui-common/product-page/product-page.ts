import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { IProduct } from 'src/app/domains/home/data/model/home.model';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Router, RouterModule } from '@angular/router';
import { LazyImgDirective } from '../../directives/lazyImage/lazyImage.directive';
import { debounceTime, Subject } from 'rxjs';
import { AuthState } from 'src/app/domains/auth/login/state/login.state';
import { CartService } from 'src/app/domains/cart/data/services/cart.services';
import { SearchService } from 'src/app/domains/search-result-page/data/service/search.service';
import { MessageService } from '@logger/message.service';

@Component({
  selector: 'app-product-page',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // third-party
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

  // Track quantities per product by stockMasterId
  quantities = signal<Record<number, number>>({});
  private quantityChanges$ = new Subject<{
    productId: number;
    value: number;
  }>();

  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  private readonly authState = inject(AuthState);
  authenticated = this.authState.isAuthenticated;
  productState = inject(SearchService);

  constructor() {
    effect(() => {
      const products = this.data();
      this.productState.setData([products]);
    });
    this.quantityChanges$
      .pipe(debounceTime(400))
      .subscribe(({ productId, value }) => {
        // const item = this.data.find((p) => p.stockMasterId === productId);
        const item = this.productState
          .filteredProducts()
          .find((p) => p.stockMasterId === productId);
        if (item) this.updateStock(item, value);
      });
  }

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
    console.log('dfad', this.authenticated());

    if (!this.authenticated()) {
      this.messageService.createMessage('info', 'Login to add items to cart');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.updateStock(product, 1);

    // if (!product.inStock) {
    //   // this.message.error(`${product.name} is out of stock`);
    //   return;
    // }
    // this.updateStock(product, 1);
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

  onViewDetail(info: IProduct): void {
    const encodedObject = encodeURIComponent(JSON.stringify(info));

    this.router.navigate(['/home/product-detail'], {
      queryParams: { data: encodedObject },
    });
  }
  // start from here
  updateStock(item: any, change: number) {
    console.log('updating stock for item', item, 'with change', change);
    if (change === null) return;
    const payload = {
      stockMasterId: item.stockMasterId,
      unitId: item.unitId,
      qty: this.quantities()[item.stockMasterId] || 1,
    };
    console.log('payload', payload);

    this.cartService.saveCart(payload).subscribe((res) => {
      const updatedProduct = res;
      this.messageService.createMessage(
        'success',
        `${item.name} added to your cart successfully`
      );
      // this.data = this.data.map((product) =>
      const updatedDate = this.productState
        .filteredProducts()
        .map((product) =>
          product.stockMasterId === updatedProduct.stockMasterId
            ? { ...product, ...updatedProduct }
            : product
        );
      this.productState.setData(updatedDate);

      this.cartService.refreshCartCount();
    });
  }
}
