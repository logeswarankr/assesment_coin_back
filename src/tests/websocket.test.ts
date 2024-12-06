import WebSocket from 'ws';

describe('WebSocket Server', () => {
    let ws: WebSocket;

    beforeEach(() => {
        ws = new WebSocket('ws://localhost:8081');
    });

    afterEach(() => {
        ws.close();
    });

    it('should connect to the WebSocket server', (done) => {
        ws.on('open', () => {
            expect(ws.readyState).toBe(WebSocket.OPEN);
            done();
        });
    });

    it('should handle subscription messages', (done) => {
        ws.on('open', () => {
            ws.send(JSON.stringify({ type: 'subscribe', product: 'BTC-USD' }));
            ws.on('message', (message) => {
                const data = JSON.parse(message.toString());
                expect(data.product_id).toBe('BTC-USD');
                done();
            });
        });
    });
});
