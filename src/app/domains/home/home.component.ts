import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ICategory } from 'src/app/domains/home/data/model/home.model';
import { ICompany } from '../company/data/model/company.model';
import { ProductSlider } from '../shared/ui-common/product-slider/product-slider';
import { deviceIdSignal } from '../shared/util-common/generateDeviceId';
import { CategoryCard } from './category-card/category-card';
import { IBannerDto, IProduct } from './data/model/home.model';
import { HomeBrandComponent } from './home-brand/home-brand.component';
import { Homeproduct } from './home-product/home-product';
import { HomeService } from './home.service';
import { SliderComponent } from './slider/slider.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HomeBrandComponent,
    CategoryCard,
    Homeproduct,
    SliderComponent,
    ProductSlider,
  ],
  providers: [],
})
export class HomeComponent implements OnInit {
  // companyList: ICompany[] = [];

  // categoryList: ICategory[] = [];
  companyList = signal<ICompany[]>([]);
  categoryList = signal<ICategory[]>([]);
  productList = signal<IProduct[]>([]);
  bannerList = signal<IBannerDto[]>([]);
  isLoading = signal<boolean>(false);
  category1 = signal<ICategory[]>([]);
  category2 = signal<ICategory[]>([]);
  category3 = signal<ICategory[]>([]);
  category4 = signal<ICategory[]>([]);
  category5 = signal<ICategory[]>([]);
  category6 = signal<ICategory[]>([]);
  category7 = signal<ICategory[]>([]);
  category8 = signal<ICategory[]>([]);

  title1 = signal<string>('');
  title2 = signal<string>('');
  title3 = signal<string>('');
  title4 = signal<string>('');
  title5 = signal<string>('');
  title6 = signal<string>('');
  title7 = signal<string>('');
  title8 = signal<string>('');

  private readonly unsubscribe$ = inject(DestroyRef);

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  private readonly homeService = inject(HomeService);

  ngOnInit(): void {
    this.fetchHomeContents();
  }

  private fetchHomeContents(): void {
    this.isLoading.set(true);
    const deviceId = deviceIdSignal();

    this.homeService
      .getHomeContents(deviceId)
      .pipe(takeUntilDestroyed(this.unsubscribe$))
      .subscribe((res: any) => {
        // this.onTrackView();

        this.bannerList.set(res.bannerList);
        this.companyList.set(res.companyList);
        this.categoryList.set(res.categoryList);
        this.productList.set(res.stockList);
        this.category1.set(res.categoryList[0].stockList);
        this.category2.set(res.categoryList[1].stockList);
        this.category3.set(res.categoryList[2].stockList);
        this.category4.set(res.categoryList[3].stockList);
        this.category5.set(res.categoryList[4].stockList);
        this.category6.set(res.categoryList[5].stockList);
        this.category7.set(res.categoryList[6].stockList);
        this.category8.set(res.categoryList[7].stockList);

        // title;
        this.title1.set(res.categoryList[0].name);
        this.title2.set(res.categoryList[1].name);
        this.title3.set(res.categoryList[2].name);
        this.title4.set(res.categoryList[3].name);
        this.title5.set(res.categoryList[4].name);
        this.title6.set(res.categoryList[5].name);
        this.title7.set(res.categoryList[6].name);
        this.title8.set(res.categoryList[7].name);
        this.isLoading.set(false);
        console.log('title', this.title1());
      });
  }
}
