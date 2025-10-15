import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  model,
  ViewChild,
} from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NepaliDateFormatterPipe } from '../../pipes/nepali-date-formatter.pipe';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';
import { TruncatePipe } from '../../util-common/truncate.pipe';
import { PageHeaderSection } from '../page-header-section/page-header-section';
import { Router, ActivatedRoute } from '@angular/router';

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
    NgOptimizedImage,
    NzSkeletonModule,
    // project
    TruncatePipe,
    SanitizeHtmlPipe,
    NepaliDateFormatterPipe,
    NzCarouselModule,
    PageHeaderSection,
  ],
  templateUrl: './product-slider.html',
  styleUrl: './product-slider.scss',
})
export class ProductSlider {
  // props
  data = input<any[]>([]);

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

  scrollRight() {
    const slider = this.productSlider.nativeElement;
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    if (Math.abs(slider.scrollLeft - maxScrollLeft) < 5) {
      // Reset to beginning smoothly
      slider.scrollTo({
        left: 0,
        behavior: 'smooth',
      });
    } else {
      slider.scrollBy({
        left: 240,
        behavior: 'smooth',
      });
    }
  }

  ngOnInit(): void {
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
