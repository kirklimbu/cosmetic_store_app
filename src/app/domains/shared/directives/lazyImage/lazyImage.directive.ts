import {
  Directive,
  ElementRef,
  Renderer2,
  inject,
  input,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';

@Directive({
  selector: '[appLazyImg]',
  standalone: true,
})
export class LazyImgDirective {
  private el = inject(ElementRef<HTMLImageElement>);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);

  // ✅ Inputs using Angular signals
  appLazyImg = input.required<string>();
  fallbackImg = input<string>('assets/images/no-image.png');

  // ✅ Internal state signals
  private isLoading = signal(true);
  private observer?: IntersectionObserver;

  constructor() {
    // ✅ Apply shimmer effect reactively
    effect(() => {
      const el = this.el.nativeElement;
      if (this.isLoading()) {
        this.renderer.setStyle(el, 'opacity', '0.5');
        this.renderer.setStyle(
          el,
          'background',
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)'
        );
        this.renderer.setStyle(el, 'backgroundSize', '200% 100%');
        this.renderer.setStyle(el, 'animation', 'shimmer 1.2s infinite linear');
      } else {
        this.renderer.removeStyle(el, 'background');
        this.renderer.removeStyle(el, 'animation');
        this.renderer.setStyle(el, 'opacity', '1');
        this.renderer.setStyle(el, 'transition', 'opacity 0.3s ease-in');
      }
    });

    // ✅ Observe for lazy load trigger
    this.observeImage();

    // ✅ Auto cleanup on destroy
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  private observeImage() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.setImageSrc();
            this.observer?.unobserve(this.el.nativeElement);
          }
        }
      });
      this.observer.observe(this.el.nativeElement);
    } else {
      this.setImageSrc();
    }
  }

  private setImageSrc() {
    const el = this.el.nativeElement;
    const src = this.appLazyImg() || this.fallbackImg();

    this.isLoading.set(true);

    // ✅ Handle load & error once, without double setting
    const onLoad = () => this.isLoading.set(false);
    const onError = () => {
      this.renderer.setAttribute(el, 'src', this.fallbackImg());
      this.isLoading.set(false);
    };

    el.addEventListener('load', onLoad, { once: true });
    el.addEventListener('error', onError, { once: true });

    // ✅ Only assign once
    this.renderer.setAttribute(el, 'src', src);
  }
}
