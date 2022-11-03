import * as _ws from 'ws'

// workaround for jest or node bug
export const WebSocketServer = _ws.WebSocketServer
  ? _ws.WebSocketServer
  : // @ts-ignore
    _ws.default.WebSocketServer
