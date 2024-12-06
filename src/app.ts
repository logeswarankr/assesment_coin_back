import express,{Request,Response} from 'express';
import { setupWebSocketServer } from './websocket';
import { config } from './config/env';
import { logger } from './utils/logger';

const app = express();
const port = config.port;

// WebSocket Server
setupWebSocketServer();

// Health Check Endpoint
app.get('/health', (_: Request, res: Response) => {
    res.send('Server is up and running!');
  });

// Start Server
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});
