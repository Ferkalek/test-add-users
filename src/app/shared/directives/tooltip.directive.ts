import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipTitle: string;
  tooltip: HTMLElement | null;
  offset = 10;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip) {
      this.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  ngOnDestroy() {
    this.hide();
  }

  private show() {
    this.tooltip = this.renderer.createElement('span');
    this.tooltip!.className = 'custom-tooltip';
    this.tooltip!.textContent = this.tooltipTitle;

    this.renderer.appendChild(document.body, this.tooltip);
    const hostPos = this.el.nativeElement.getBoundingClientRect();

    const tooltipPos = this.tooltip!.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height - this.offset * 2.5;
    const left =
      hostPos.left + (hostPos.width - tooltipPos.width) / 2 - this.offset;

    this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'background-color', '#000');
    this.renderer.setStyle(this.tooltip, 'color', '#fff');
    this.renderer.setStyle(this.tooltip, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltip, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltip, 'z-index', '1000');
    this.renderer.setStyle(this.tooltip, 'white-space', 'nowrap');
  }

  private hide() {
    this.renderer.removeChild(document.body, this.tooltip);
    this.tooltip = null;
  }
}
