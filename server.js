import express from 'express';
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';
import http from 'http';
import {Server as socketIO } from 'socket.io';
import authRoute from "./routes/auth.js";
import groupRoute from "./routes/group.js";
import config from "./config/config.js";
import Message from './models/Message.js';

const app = express();
const server = http.createServer(app);
const io = new socketIO(server);

//using middlewares cors and bodyparser
app.use(cors());
app.use(bodyparser.json());

const PORT = config.app.port;


//Database connection
mongoose.connect(`mongodb://${config.db.baseUrl}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

//routes
app.use("/api/auth", authRoute);
app.use("/api/group", groupRoute);

//server listening to the port
app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`);
});

//socket.io connection
io.on('connection',(socket)=>{
  console.log("New user connected");
  socket.on('join-group', ({groupId})=>{
    socket.join(groupId);
  });

  socket.on('sendMessage', async({content, groupId, userId})=>{
    const message = new Message({content, group: groupId, user: userId});
    await message.save();
    socket.to(group).emit("message", message);
  });

  socket.on('likeMessage', async({userId, messageId})=>{
    const message = await Message.findById(messageId);
    if(!message.likes.includes(userId)){
      message.likes.push(userId);
      await message.save();
    }
    io.to(message.group.toString()).emit("messageLiked", {userId, messageId});
  });

  socket.on('disconnect', ({username})=>{
    io.emit(`${username} disconnected`);
  });
});

export default server;