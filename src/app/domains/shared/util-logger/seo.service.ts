import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  // constructor(private meta: Meta, private titleService: Title) {}

  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);

  public setMetaDescription(content: string) {
    this.meta.updateTag({
      name: 'description',
      content: content,
    });
  }

  public setMetaTitle(title: string) {
    this.titleService.setTitle(title);
  }

  /**
   * Generalized SEO updater
   * @param products - Array of product names
   * @param context - What kind of content is this (e.g., 'Recommended', 'New', 'Trending', 'Search')
   * @param brand - Optional brand name or source
   */
  public updateSeoFromProducts(
    products: string[],
    context: 'Brand' | 'Category' | 'Home' | 'Product' | 'Search',
    brand?: string
  ) {
    const siteName = 'shree shyam suppliers';
    const cleanTitles = products.filter(Boolean).slice(0, 4); // Up to 4 titles
    const titlesString = cleanTitles.join(', ');
    // Title tag: include product titles for better ranking
    let title = `${titlesString} – ${siteName}`;

    // Fallback: if titles are empty or too short, use context-based title
    if (!cleanTitles.length || titlesString.length < 20) {
      title = `${context} Products – ${siteName}`;
    }

    // Meta description
    let description = `Explore ${context.toLowerCase()} picks: ${titlesString}`;
    if (context === 'Search') {
      description = `Top results: ${titlesString}`;
    }
    if (brand) {
      description += ` by ${brand}`;
    }
    description += `. Shop best deals online at ${siteName}.`;
    this.setMetaTitle(title);
    this.setMetaDescription(description);
    // console.log('title', title, 'descr', JSON.stringify(description));
  }
}
