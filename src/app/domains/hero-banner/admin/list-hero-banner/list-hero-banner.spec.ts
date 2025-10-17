import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHeroBanner } from './list-hero-banner';

describe('ListHeroBanner', () => {
  let component: ListHeroBanner;
  let fixture: ComponentFixture<ListHeroBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHeroBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListHeroBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
