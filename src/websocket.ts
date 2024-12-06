import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config/env';
import { logger } from './utils/logger';

interface Client {
    id: string;
    ws: WebSocket;
    subscriptions: string[];
}

const clients: Map<string, Client> = new Map();

export const setupWebSocketServer = () => {
    const server = new WebSocketServer({ port: 8081 });
    const coinbaseSocket = new WebSocket(config.coinbaseWsUrl);

    // Handle Coinbase messages
    coinbaseSocket.on('message', (data:any) => {
        const parsedData = JSON.parse(data.toString());
        broadcast(parsedData);
    });

    server.on('connection', (ws:any) => {
        const clientId = uuidv4();
        clients.set(clientId, { id: clientId, ws, subscriptions: [] });

        ws.on('message', (message:any) => {
            const { type, product } = JSON.parse(message.toString());
            const client = clients.get(clientId);

            if (type === 'subscribe' && client) {
                client.subscriptions.push(product);
                coinbaseSocket.send(
                    JSON.stringify({
                        type: 'subscribe',
                        product_ids: [product],
                        channels: ['level2', 'matches'],
                    })
                );
            }

            if (type === 'unsubscribe' && client) {
                client.subscriptions = client.subscriptions.filter((p) => p !== product);
                coinbaseSocket.send(
                    JSON.stringify({
                        type: 'unsubscribe',
                        product_ids: [product],
                        channels: ['level2', 'matches'],
                    })
                );
            }
        });

        ws.on('close', () => clients.delete(clientId));
    });

    logger.info('WebSocket Server running on port 8081');
};

const broadcast = (data: any) => {
    clients.forEach(({ ws, subscriptions }) => {
        if (subscriptions.includes(data.product_id)) {
            ws.send(JSON.stringify(data));
        }
    });
};
