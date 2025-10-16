import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  Input,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { IProduct } from 'src/app/domains/home/data/model/home.model';

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
  // data = input<any[]>([]);
  // @Input() data: any;
  data = input<IProduct[]>([]);

  @ViewChild('productSlider', { static: false }) productSlider!: ElementRef;

  private router = inject(Router);

  private cd: ChangeDetectorRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

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

  ngOnInit(): void {
    console.log('product slider', this.data);

    if (!this.data().length) {
      // this.fetchList();
      // this.data.set([]);
    }
  }

  // private fetchList() {
  //   this.eventService
  //     .getEventCatergoryList()
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((res) => {
  //       this.data.set(res);
  //     });
  // }

  // START FORM ROUTES SERVICE DETAIL
  onViewMore(id: number): void {
    console.log('view product detail', id);
    this.router.navigate(['event-list'], {
      queryParams: { id: id },
    });
  }
}
