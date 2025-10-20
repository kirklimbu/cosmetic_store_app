import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { debounceTime, map, Subject } from 'rxjs';
import { AuthState } from '../../auth/login/state/login.state';
import { CartService } from '../../cart/data/services/cart.services';
import { SearchService } from '../../search-result-page/data/service/search.service';
import { LazyImgDirective } from '../../shared/directives/lazyImage/lazyImage.directive';
import { IProduct } from '../data/model/home.model';
@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // third-party
    NzCardModule,
    NzButtonModule,
    NzImageModule,
    NzRateModule,
    NzTagModule,
    NzGridModule,
    NzIconModule,
    NzBadgeModule,
    NzTabsModule,
    NzDividerModule,
    NzStatisticModule,
    // project
    LazyImgDirective,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  // data = input<IProduct[]>([]);
  qty = signal<number>(1);

  title = input<string>('Our Products');
  enableDelete = input<boolean>(false);
  enableDeleteAll = input<boolean>(false);
  showActionButtons = input<boolean>(true);
  delete = output<number>();
  emptyCart = output<void>();

  private message = inject(NzMessageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly authState = inject(AuthState);
  authenticated = this.authState.isAuthenticated;
  productState = inject(SearchService);

  // Track quantities per product by stockMasterId
  quantities = signal<Record<number, number>>({});
  private quantityChanges$ = new Subject<{
    productId: number;
    value: number;
  }>();

  quantity = signal(1);

  // Signal to get the encoded data
  encodedData = toSignal(
    this.route.queryParams.pipe(map((params) => params['data'])),
    { initialValue: this.route.snapshot.queryParams['data'] }
  );

  // Computed signal to decode the object
  product = computed(() => {
    const encoded = this.encodedData();
    if (!encoded) return null;

    try {
      // console.log(JSON.parse(decodeURIComponent(encoded)).name);
      return JSON.parse(decodeURIComponent(encoded));
    } catch (error) {
      console.error('Error parsing object from URL:', error);
      return null;
    }
  });

  // Computed signals
  stockStatus = computed(() => {
    const remaining = this.product().remaining;
    if (remaining === 0)
      return { text: 'Out of Stock', color: 'red', type: 'error' };
    if (remaining < 5)
      return {
        text: `Only ${remaining} left`,
        color: 'orange',
        type: 'warning',
      };
    return { text: 'In Stock', color: 'green', type: 'success' };
  });

  isLowStock = computed(() => this.product().remaining < 10);
  canAddToCart = computed(() => this.product().remaining > 0);

  constructor() {
    // effect(() => {
    //   const products = this.data();
    //   this.productState.setData(products);
    // });
    // this.quantityChanges$
    //   .pipe(debounceTime(400))
    //   .subscribe(({ productId, value }) => {
    //     // const item = this.data.find((p) => p.stockMasterId === productId);
    //     const item = this.productState
    //       .filteredProducts()
    //       .find((p) => p.stockMasterId === productId);
    //     if (item) this.updateStock(item, value);
    //   });
  }

  // updateQuantity(value: any) {
  //   if (value > 0) this.quantity.set(value);
  // }

  getQty(productId: number, fallbackQty: number): number {
    return this.quantities()[productId] ?? fallbackQty ?? 0;
  }

  updateQuantity(productId: number, value: number): void {
    if (value < 0) value = 0;
    this.quantities.update((q) => ({ ...q, [productId]: value }));

    this.quantityChanges$.next({ productId, value });
  }
  increaseQty(productId: number): void {
    const backendQty =
      // this.data.find((p) => p.stockMasterId === productId)?.qty ?? 0;
      this.productState
        .filteredProducts()
        .find((p) => p.stockMasterId === productId)?.qty ?? 0;
    const current = this.quantities()[productId] ?? backendQty;
    this.updateQuantity(productId, current + 1);
  }

  decreaseQty(productId: number): void {
    const backendQty =
      // this.data.find((p) => p.stockMasterId === productId)?.qty ?? 0;
      this.productState
        .filteredProducts()
        .find((p) => p.stockMasterId === productId)?.qty ?? 0;
    const current = this.quantities()[productId] ?? backendQty;
    if (current > 0) {
      this.updateQuantity(productId, current - 1);
    }
  }

  updateStock(item: any, change: number) {
    // console.log('updating stock for item', item, 'with change', change);
    if (change === null) return;
    const payload = {
      stockMasterId: item.stockMasterId,
      unitId: item.unitId,
      qty: this.quantities()[item.stockMasterId] || 0,
    };

    this.cartService.saveCart(payload).subscribe((res) => {
      const updatedProduct = res;
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
  onViewDetails(id: any) {
    console.log('click', id);
    this.router.navigate(['product-detail'], { queryParams: { id: id } });
  }

  removeItem(id: number) {
    this.delete.emit(id);
  }

  onEmptyCart() {
    this.emptyCart.emit();
  }

  addToCart(): void {
    if (!this.canAddToCart()) {
      this.message.error('Product is out of stock');
      return;
    }

    this.message.success(
      `Added ${this.quantity()} ${this.product().name} to cart`
    );
    // Implement your cart logic here
  }

  buyNow(): void {
    if (!this.canAddToCart()) {
      this.message.error('Product is out of stock');
      return;
    }

    this.message.success(
      `Proceeding to buy ${this.quantity()} ${this.product().name}`
    );
    // Implement buy now logic here
  }

  formattedPrice(n: number) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
      n
    );
  }

  saving(): number {
    const p = this.product();
    if (!p) return 0;
    const diff = p.mrp - p.pricePerUnit;
    return diff > 0 ? diff : 0;
  }

  isOutOfStock(): boolean {
    const p = this.product();
    if (!p) return true;
    return p.remaining <= 0;
  }

  onSelectImage(idx: number) {
    // this.selectedImageIndex.set(idx);
  }
  onQtyChange(value: number | null) {
    this.qty.set(value && value > 0 ? value : 1);
  }
}
