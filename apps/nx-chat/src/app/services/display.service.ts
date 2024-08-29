import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { IMessage } from '../interfaces/imessage';
import { DisplaySocketService } from './display-socket.service';

@Injectable()
export class DisplayService {
  private _allMessages = signal<IMessage[]>([]);
  private _currentMessage = signal<IMessage>(this._getNewMessage());

  private _displaySocket = inject(DisplaySocketService);

  constructor() {
    this._receiveSocketMessages();
  }

  /**
   * A getter for all on screen messages.
   */
  get allMessages(): Signal<IMessage[]> {
    return computed(() => [this._currentMessage(), ...this._allMessages()]);
  }

  /**
   * Sets the current message value.
   *
   * @param value
   */
  public updateCurrentMessage(value: string): void {
    this._currentMessage.update((message) => ({ ...message, value }));
  }

  /**
   * Displays a new message on screen and saves it to the backend.
   */
  public addMessage(): void {
    const addedMessage = { ...this._currentMessage(), fulfilled: true };
    this._displaySocket.sendMessage(addedMessage);

    this._allMessages.update((messages) => [
      addedMessage,
      ...messages.map((message) => ({ ...message, fulfilled: true })),
    ]);

    this._currentMessage.set(this._getNewMessage());
  }

  private _receiveSocketMessages(): void {
    this._displaySocket.socket.subscribe((message) =>
      this._parseMessage(message)
    );
  }

  private _parseMessage(payload: any): void {
    if (payload.length) {
      console.log(payload);
      this._allMessages.update((messages) => [...messages, ...payload]);
    } else {
      this._allMessages.update((messages) => [
        payload,
        ...messages.map((message) => ({ ...message, fulfilled: true })),
      ]);
    }
  }

  private _getNewMessage(): IMessage {
    return {
      xPosition: this._getStartPosition(),
      yPosition: this._getStartPosition(),
      value: '',
      fulfilled: false,
      color: this._getColor(),
    };
  }

  private _getStartPosition(): number {
    return Math.random() * 70;
  }

  private _getColor(): string {
    return (
      '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')
    );
  }
}
