import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BannerService } from '../../data/service/banner.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';
import { IBannerDto } from 'src/app/domains/home/data/model/home.model';

@Component({
  selector: 'app-list-hero-banner',
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    // third-party
    NzTableModule,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './list-hero-banner.html',
  styleUrl: './list-hero-banner.scss',
})
export class ListHeroBanner implements OnInit {
  // props
  data$: Observable<IBannerDto[]>;

  private router = inject(Router);
  private bannerService = inject(BannerService);

  ngOnInit(): void {
    this.fetchEventList();
  }

  private fetchEventList(): void {
    console.log('calling fetch list');
    this.data$ = this.bannerService.getBannerList();
  }

  onAdd(): void {
    this.router.navigate(['/auth/add-hero-banner']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/auth/add-hero-banner'], {
      queryParams: {
        id: id,
      },
    });
  }

  // Example onDelete method
  onDelete(id: number): void {
    // this.modal.confirm({
    //   nzTitle: 'Are you sure you want to delete this service?',
    //   nzContent: 'This action cannot be undone.',
    //   nzOkText: 'Yes, Delete',
    //   nzOkType: 'danger',
    //   nzOnOk: () => this.confirmDelete(id)
    // });
  }

  confirmDelete(id: number): void {
    // Call your service to delete the item
    console.log('Deleting service with ID:', id);
  }
}
