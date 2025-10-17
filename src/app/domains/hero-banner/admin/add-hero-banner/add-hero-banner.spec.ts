import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddHeroBanner } from './add-hero-banner';

describe('AddHeroBanner', () => {
  let component: AddHeroBanner;
  let fixture: ComponentFixture<AddHeroBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHeroBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(AddHeroBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
