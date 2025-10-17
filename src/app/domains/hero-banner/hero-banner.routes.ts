import { Routes } from '@angular/router';
import { AddHeroBanner } from './admin/add-hero-banner/add-hero-banner';
import { ListHeroBanner } from './admin/list-hero-banner/list-hero-banner';

export const FEATURE_HERO_BANNER_ROUTES: Routes = [
  // admin
  {
    path: 'add-hero-banner',
    component: AddHeroBanner,
  },
  {
    path: 'list-hero-banner',
    component: ListHeroBanner,
  },
];
