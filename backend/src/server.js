const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const messageController = require('./controllers/messageController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes, messageRoutes, chatRoutes);

// 🔥 Socket.io Connection
io.on('connection', (socket) => {
  console.log('✅ A user connected:', socket.id);

  socket.on('sendMessage', async (messageData) => {
    try {
      console.log('📨 Incoming message:', messageData);
      const message = await messageController.sendMessage(messageData);
      io.emit('receiveMessage', message);
    } catch (error) {
      console.error('🚨 Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// 🛠 Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR HANDLER:", err.stack || err);
  res.status(500).json({ message: "Internal Server Error", error: err.message || "Unknown error" });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
