import { ClassBinder } from '../../services/class-binder.service';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Injector,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DisplayService } from '../../services/display.service';
import { IMessage } from '../../interfaces/imessage';
import { ChatDisplayMessageComponent } from '../chat-display-message/chat-display-message.component';

@Component({
  standalone: true,
  selector: 'app-chat-display',
  templateUrl: 'chat-display.component.html',
  styleUrl: 'chat-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ClassBinder],
})
export class ChatDisplayComponent implements AfterViewInit {
  private _display = inject(DisplayService);

  constructor(
    classBinder: ClassBinder,
    private _viewContainerRef: ViewContainerRef,
    private _injector: Injector
  ) {
    classBinder.bind('app-chat-display');
  }

  public ngAfterViewInit(): void {
    this._handleAddMessage();
  }

  private _handleAddMessage(): void {
    effect(() => this._updateMessages(this._display.allMessages()), {
      injector: this._injector,
    });
  }

  private _updateMessages(messages: IMessage[]): void {
    this._viewContainerRef.clear();
    messages.forEach((message) => this._createMessage(message));
  }

  private _createMessage(message: IMessage): void {
    const { value, xPosition, yPosition, fulfilled, color } = message;
    const ref = this._viewContainerRef.createComponent(
      ChatDisplayMessageComponent
    );

    ref.setInput('value', value);
    ref.setInput('position', { xPosition, yPosition });
    ref.setInput('fulfilled', fulfilled);
    ref.setInput('color', color);
  }
}
