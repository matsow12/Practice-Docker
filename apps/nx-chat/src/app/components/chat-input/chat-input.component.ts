import { ClassBinder } from '../../services/class-binder.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DisplayService } from '../../services/display.service';

@Component({
  standalone: true,
  selector: 'app-chat-input',
  templateUrl: 'chat-input.component.html',
  styleUrl: 'chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [ClassBinder],
  imports: [InputTextModule, FormsModule, ButtonModule],
})
export class ChatInputComponent {
  public textValue = '';

  private _display = inject(DisplayService);

  constructor(classBinder: ClassBinder) {
    classBinder.bind('app-chat-input');
  }

  public onTextChange(value: string): void {
    this._display.updateCurrentMessage(value);
    this.textValue = value;
  }

  public onClick(): void {
    this._display.addMessage();
    this._display.updateCurrentMessage('');
    this.textValue = '';
  }
}
