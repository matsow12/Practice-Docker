import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IMessage } from '../interfaces/imessage';

@Injectable()
export class DisplaySocketService {
  private _socket: WebSocketSubject<any>;

  constructor() {
    this._socket = this._initConnection();
    this._getDbMessages();
  }

  /**
   * A getter for the socket subject.
   */
  get socket(): WebSocketSubject<any> {
    return this._socket;
  }

  /**
   * Sending message to the websocket.
   *
   * @param message
   */
  public sendMessage(message: IMessage): void {
    this._socket.next({ type: 'WS', value: message });
  }

  private _initConnection(): WebSocketSubject<string> {
    return webSocket('ws://localhost:3000');
  }

  private _getDbMessages(): void {
    this._socket.next({ type: 'DB', value: 'GET_MESSAGES' });
  }
}
