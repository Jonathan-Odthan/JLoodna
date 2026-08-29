/**
 * WebSocket Server for real-time notifications
 * Jloodna | Global Trading
 */
const WebSocket = require('ws');

let wss = null;
const clients = new Map(); // userId -> ws

function initWebSocket(server) {
  wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const userId = new URL(req.url, 'http://localhost').searchParams.get('userId') || 'guest';
    clients.set(userId, ws);

    ws.on('message', (msg) => {
      try {
        const data = JSON.parse(msg);
        if (data.type === 'ping') ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
      } catch (e) {}
    });

    ws.on('close', () => clients.delete(userId));

    // Send welcome
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connecté aux notifications temps réel',
      timestamp: Date.now()
    }));
  });

  return wss;
}

function broadcast(notification) {
  if (!wss) return;
  const msg = JSON.stringify({ type: 'notification', ...notification, timestamp: Date.now() });
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg);
  });
}

function sendToUser(userId, notification) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'notification', ...notification, timestamp: Date.now() }));
  }
}

module.exports = { initWebSocket, broadcast, sendToUser };
