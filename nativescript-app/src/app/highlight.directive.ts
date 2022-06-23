import { Directive, ElementRef, HostListener, inject } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class HighlightDirective {
  currentColor = "";
  private el = inject(ElementRef);

  @HostListener("tap") onTap() {
    if (this.currentColor) {
      this.currentColor = "";
    } else {
      this.currentColor = "yellow";
    }
    this.highlight(this.currentColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
