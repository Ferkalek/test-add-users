import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appValidationMessage]',
})
export class ValidationMessageDirective implements OnInit, OnDestroy {
  @Input() control: AbstractControl | null = null;

  private statusChangesSubscription: Subscription | null = null;
  private errorElement: HTMLElement | null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (this.control) {
      this.statusChangesSubscription = this.control.statusChanges.subscribe(
        () => this.updateFieldState()
      );
    }
  }

  updateFieldState() {
    if (
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    ) {
      this.renderer.addClass(this.el.nativeElement, 'is-invalid');
      this.showErrorMessage();
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'is-invalid');
      this.removeErrorMessage();
    }
  }

  showErrorMessage() {
    this.removeErrorMessage();

    this.errorElement = this.renderer.createElement('small');
    this.errorElement!.className = 'invalid-feedback';
    const text = this.renderer.createText(this.getErrorMessage());
    this.renderer.appendChild(this.errorElement, text);
    this.renderer.appendChild(
      this.el.nativeElement.parentNode,
      this.errorElement
    );
  }

  removeErrorMessage() {
    if (this.errorElement) {
      this.renderer.removeChild(
        this.el.nativeElement.parentNode,
        this.errorElement
      );
      this.errorElement = null;
    }
  }

  getErrorMessage(): string {
    const errorMessages: { [key: string]: string } = {
      invalidCountry: 'Please provide a correct Country',
      invalidUsername: 'Please provide a correct Username',
      invalidBirthday: 'Please provide a correct Birthday',
    };

    const errorKey = Object.keys(this.control?.errors || {}).find(
      (key) => errorMessages[key]
    );

    return errorKey ? errorMessages[errorKey] : 'This field is required';
  }

  ngOnDestroy() {
    if (this.statusChangesSubscription) {
      this.statusChangesSubscription.unsubscribe();
    }

    this.removeErrorMessage();
  }
}
