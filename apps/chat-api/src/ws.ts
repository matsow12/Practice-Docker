import { createServer, Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import { DatabaseController } from './db';

export class WebSocketController {
  private _server: Server;
  private _wsServer: WebSocketServer;
  private _connected: Map<string, WebSocket> = new Map();

  private PORT = 3000;

  constructor(private _dbController: DatabaseController) {}

  public initialize(): void {
    this._server = this._createServer();
    this._wsServer = this._createWSServer();
    this._handleConnections();

    this._server.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }

  private _handleConnections(): void {
    this._wsServer.on('connection', (connection) => {
      const id = v4();
      this._connected.set(id, connection);

      connection.onmessage = ({ data }) => {
        const [type, payload] = this._parseMessage(data.toString());

        switch (type) {
          case 'DB':
            this._sendDbMessages(connection);
            break;
          case 'WS':
            this._broadcastMessage(JSON.stringify(payload));
        }
      };
    });
  }

  private _sendDbMessages(connection: WebSocket): void {
    this._dbController.getMessages().then((response) => {
      const { rows } = response;
      const messages = rows.map((row) => ({
        fulfilled: true,
        xPosition: row.x_pos,
        yPosition: row.y_pos,
        value: row.message_text,
        color: row.color,
      }));
      connection.send(JSON.stringify(messages));
    });
  }

  private _parseMessage(data: string): Array<any> {
    const { type, value } = JSON.parse(data);
    return [type, value];
  }

  private _createServer(): Server {
    return createServer();
  }

  private _createWSServer(): WebSocketServer {
    const server = this._server;
    return new WebSocketServer({ server });
  }

  private _broadcastMessage(message): void {
    const { xPosition, yPosition, value, color } = JSON.parse(message);
    this._dbController.sendMessage(value, xPosition, yPosition, color);
    this._connected.forEach((connected) => {
      if (connected.readyState === 1) {
        connected.send(message);
      }
    });
  }
}
