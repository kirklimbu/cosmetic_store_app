import { Component, input } from '@angular/core';
import { Observable } from 'rxjs';
// third-party
import { CommonModule } from '@angular/common';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { LazyImgDirective } from '../../shared/directives/lazyImage/lazyImage.directive';
import { IBannerDto } from '../data/model/home.model';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [CommonModule, NzCarouselModule, LazyImgDirective],
})
export class SliderComponent {
  effect = 'scrollx';
  array = [1, 2, 3, 4];

  data$!: Observable<any[]>;
  // @Input() data!: any

  data = input<IBannerDto[]>();
}
