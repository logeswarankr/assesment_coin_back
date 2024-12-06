import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 8080,
    coinbaseWsUrl: process.env.COINBASE_WS_URL || 'wss://ws-feed.pro.coinbase.com',
};
