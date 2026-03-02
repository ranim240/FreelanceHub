import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: 'product-detail.page.html',
  styleUrls: ['product-detail.page.scss'],
  standalone: false
})
export class ProductDetailPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLElement>;
  @ViewChild('carouselWrapper') carouselWrapper!: ElementRef<HTMLElement>;

  product: Product | null = null;
  isAddedToCart = false;
  isWishlisted  = false;

  // ── Carousel state ───────────────────────────────────────────
  techStackDoubled: string[] = [];

  private offset       = 0;          // current translateX in px
  private speed        = 0.3;        // px per frame (auto-scroll speed)
  private halfWidth    = 0;          // half of track width (reset point)
  private rafId        = 0;          // requestAnimationFrame id
  private isHovered    = false;      // mouse is over carousel
  private isDragging   = false;
  private dragStartX   = 0;
  private dragStartOffset = 0;
  // Bound listeners stored for cleanup
  private boundMouseMove = this.onDragMove.bind(this);
  private boundMouseUp   = this.onDragEnd.bind(this);
  private boundTouchMove = this.onTouchMove.bind(this);
  private boundTouchEnd  = this.onTouchEnd.bind(this);
  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.productService.getProductById(id);
      })
    ).subscribe(product => {
      this.product = product || null;
      if (this.product) {
        this.techStackDoubled = [...this.product.techStack, ...this.product.techStack];
        this.cdr.detectChanges(); // Trigger change detection
      }
    });
  }

  ngAfterViewInit(): void {
    // Wait for *ngFor to render chips, then measure & start
    setTimeout(() => this.initCarousel(), 100);
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseup',   this.boundMouseUp);
    window.removeEventListener('touchmove', this.boundTouchMove);
    window.removeEventListener('touchend',  this.boundTouchEnd);
  }

  // ── Carousel init ─────────────────────────────────────────────
  private initCarousel(): void {
    const track = this.carouselTrack?.nativeElement;
    if (!track) return;

    const chips = track.querySelectorAll<HTMLElement>('.tc-chip');
    const totalChips = chips.length;
    const halfCount  = totalChips / 2;

    // Measure the exact pixel position where the duplicate set starts
    // This is the offsetLeft of the (halfCount)-th chip
    if (chips[halfCount]) {
      this.halfWidth = chips[halfCount].offsetLeft;
    } else {
      this.halfWidth = track.scrollWidth / 2;
    }

    this.offset = 0;
    this.tick();
  }

  private tick(): void {
    this.rafId = requestAnimationFrame(() => {
      if (!this.isDragging && !this.isHovered) {
        this.offset += this.speed;
        // Seamless loop: reset exactly when we reach the duplicate set
        if (this.halfWidth > 0 && this.offset >= this.halfWidth) {
          this.offset = this.offset - this.halfWidth;
        }
      }
      const track = this.carouselTrack?.nativeElement;
      if (track) {
        track.style.transform = `translateX(${-this.offset}px)`;
      }
      this.tick();
    });
  }

  // ── Hover pause ───────────────────────────────────────────────
  onCarouselEnter(): void { this.isHovered = true;  }
  onCarouselLeave(): void { this.isHovered = false; }

  // ── Mouse drag ────────────────────────────────────────────────
  onDragStart(e: MouseEvent): void {
    this.isDragging     = true;
    this.dragStartX     = e.clientX;
    this.dragStartOffset = this.offset;
    window.addEventListener('mousemove', this.boundMouseMove);
    window.addEventListener('mouseup',   this.boundMouseUp);
  }

  private onDragMove(e: MouseEvent): void {
    if (!this.isDragging) return;
    const delta = e.clientX - this.dragStartX;
    this.offset = this.dragStartOffset - delta;
    // Wrap around seamlessly in both directions
    if (this.halfWidth > 0) {
      this.offset = ((this.offset % this.halfWidth) + this.halfWidth) % this.halfWidth;
    }
  }

  private onDragEnd(): void {
    this.isDragging = false;
    window.removeEventListener('mousemove', this.boundMouseMove);
    window.removeEventListener('mouseup',   this.boundMouseUp);
  }

  // ── Touch drag ────────────────────────────────────────────────
  onTouchStart(e: TouchEvent): void {
    this.isDragging      = true;
    this.dragStartX      = e.touches[0].clientX;
    this.dragStartOffset = this.offset;
    window.addEventListener('touchmove', this.boundTouchMove, { passive: true });
    window.addEventListener('touchend',  this.boundTouchEnd);
  }

  private onTouchMove(e: TouchEvent): void {
    if (!this.isDragging) return;
    const delta = e.touches[0].clientX - this.dragStartX;
    this.offset = this.dragStartOffset - delta;
    if (this.halfWidth > 0) {
      this.offset = ((this.offset % this.halfWidth) + this.halfWidth) % this.halfWidth;
    }
  }

  private onTouchEnd(): void {
    this.isDragging = false;
    window.removeEventListener('touchmove', this.boundTouchMove);
    window.removeEventListener('touchend',  this.boundTouchEnd);
  }

  // ── Legacy stubs (kept for safety) ───────────────────────────
  pauseCarousel(): void  {}
  resumeCarousel(): void {}

  // ── Toggle wishlist ───────────────────────────────────────────
  toggleWishlist(): void {
    this.isWishlisted = !this.isWishlisted;
  }

  // ── Add to cart ───────────────────────────────────────────────
  addToCart(): void {
    if (!this.product) return;
    this.isAddedToCart = true;
    console.log('Added to cart:', this.product.title);
  }

  // ── Download after purchase ───────────────────────────────────
  downloadProduct(): void {
    if (!this.product) return;
    console.log('Downloading:', this.product.title);
    alert(`Downloading "${this.product.title}"...\n(Capacitor Filesystem will be used in production)`);
  }

  goBack(): void {
    this.router.navigate(['/store']);
  }

  // ── Star helpers ──────────────────────────────────────────────
  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  getEmptyStars(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  // ── Paragraph splitter ────────────────────────────────────────
  getParagraphs(text: string): string[] {
    return text.split('\n\n').filter(p => p.trim());
  }
}