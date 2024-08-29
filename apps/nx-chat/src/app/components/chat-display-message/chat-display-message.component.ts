import { ClassBinder } from '../../services/class-binder.service';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-chat-display-message',
  templateUrl: 'chat-display-message.component.html',
  styleUrl: 'chat-display-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ClassBinder],
})
export class ChatDisplayMessageComponent implements AfterViewInit {
  public value = input.required<string>();
  public position = input.required<{ xPosition: number; yPosition: number }>();
  public fulfilled = input.required<boolean>();
  public color = input.required<string>();

  constructor(
    classBinder: ClassBinder,
    private _renderer: Renderer2,
    private _elementRef: ElementRef
  ) {
    classBinder.bind('app-chat-display-message');
    effect(() => {
      if (!this.fulfilled()) {
        classBinder.bind('app-chat-display-message--unfulfilled');
      }
    });
  }

  private get _nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  public ngAfterViewInit(): void {
    this._updateMessage();
  }

  private _updateMessage(): void {
    const { innerWidth, innerHeight } = window;
    const { xPosition, yPosition } = this.position();

    this._renderer.setStyle(
      this._nativeElement,
      'top',
      (yPosition / 100) * innerHeight + 'px'
    );
    this._renderer.setStyle(
      this._nativeElement,
      'left',
      (xPosition / 100) * innerWidth + 'px'
    );

    this._renderer.setStyle(this._nativeElement, 'color', this.color());
  }
}
