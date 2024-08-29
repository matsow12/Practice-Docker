import { ElementRef, inject, Injectable } from '@angular/core';

@Injectable()
export class ClassBinder {
  private _elementRef = inject(ElementRef);

  /**
   * Binds the classname to the HTML element.
   *
   * @param className
   */
  public bind(className: string): void {
    this._elementRef.nativeElement.classList.add(className);
  }
}
