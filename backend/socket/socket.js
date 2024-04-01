import { Server } from 'socket.io';
import http from 'http'; // it`s from node.js
import express from 'express';
import Message from '../models/message.model.js';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
  console.log('user connected', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== 'undefined') userSocketMap[userId] = socket.id;

  // Join chat room based on conversation ID
  socket.on('joinRoom', (room) => {
    // Get information about users who are in the room
    const roomUsers = io.sockets.adapter.rooms.get('group_' + room);

    // Check if the user is in the room
    if (!roomUsers || !roomUsers.has(socket.id)) {
      // If the user is not in the room, then we add him to it
      socket.join('group_' + room);
      console.log(`User ${socket.id} joined room: group_${room}`);
    }
  });

  // Leave chat room based on conversation ID
  socket.on('leaveRoom', (room) => {
    console.log('room: ', room);
    socket.leave('group_' + room);
    console.log(`User ${socket.id} leave Room: `, room);
  });

  console.log('rooms', socket.rooms);

  // io.emit() is used to send events to all the connected clients - for ex: who is online or offline
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('markMessagesAsRead', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany({ conversationId, read: false }, { read: true }, { new: true });

      io.to(userSocketMap[userId]).emit('messagesRead', { conversationId });
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on() is used to listen to the events; can be used both on client and server side
  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

export { app, io, server };
