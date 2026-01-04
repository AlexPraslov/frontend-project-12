const startServer = require('@hexlet/chat-server');

const PORT = process.env.PORT || 5001;
const staticPath = process.argv[2] || './frontend/dist';

startServer({ port: PORT, staticPath });
