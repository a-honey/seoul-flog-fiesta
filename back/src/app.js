import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/errorMiddleware';
import loggerMiddleware from './middlewares/loggerMiddleware';
import authRoutes from './routers/authRouter';
import userRoutes from './routers/userRouter';
import groupRoutes from './routers/groupRouter';
import uploadRouter from './routers/uploadRouter';
import loadRouter from './routers/loadRouter';
import commentRouter from './routers/commentRouter';
import chatRouter from './routers/chatRouter';
import ploRouter from './routers/ploRouter';
import { local, jwt } from './config';
import http from 'http';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const socketIo = require('socket.io');
const passport = require('passport');
const socketIoJwt = require('socketio-jwt');

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(loggerMiddleware);
app.use(passport.initialize());
passport.use('local', local);
passport.use('jwt', jwt);

app.use(authRoutes);
app.use(userRoutes);
app.use(groupRoutes);
app.use(uploadRouter);
app.use(loadRouter);
app.use(commentRouter);
app.use(chatRouter);
app.use(ploRouter);

app.use(errorMiddleware);

/** @description 실시간 채팅 */
const io = socketIo(server, {
  path: '/chat',
  cors: {
    origin: 'http://localhost:3000', // 실제 프론트엔드 URL로 대체하세요
    methods: ['GET', 'POST'],
  },
});

io.use(
  socketIoJwt.authorize({
    secret: process.env.JWT_SECRET_KEY,
    handshake: true,
    auth_header_required: true,
  }),
);

/*

클라이언트에서 방 이름(), 본인 닉네임을 넘겨주는 방식도 가능(반영 X)

ex) 방이름을 클라이언트에서 저장하고 있어서, 요청시마다 argument로 넘겨줄 수 있음 => 매번 roomId 생성할 필요없음
ex)
속성에 nickname을 저장  // socket['nickname'] = 받아온 닉네임
nickname과 함께 보내기  // socket.to(roomId).emit(newMsg, socket.nickname)
해당 nickname을 받아 출력  // (newMsg, nickname) => {console.log(`${nickname}의 메시지: ${newMsg}`)}

*/

io.on('connection', (socket) => {
  // 인증된 사용자 정보는 소켓.decoded_token에서 확인 가능
  const loggedInUserId = socket.decoded_token.id;
  console.log(`User ${loggedInUserId} connected`);

  // 모든 이벤트가 발생할때마다 콘솔에 출력
  socket.onAny((e) => {
    console.log(`Socket Event: ${e}`);
  });

  socket.on('joinRoom', async (otherUserId, handleRoomName) => {
    // 나와 상대방 ID를 기반으로 고유한 방 ID를 생성
    const roomId = `chat_${Math.min(loggedInUserId, otherUserId)}_${Math.max(
      loggedInUserId,
      otherUserId,
    )}`;

    console.log('방 이름: ', roomId);
    // 방 들어가기
    socket.join(roomId);

    // 받은 콜백함수를 실행시킴(프론트에서 실행됨)
    handleRoomName(roomId);

    socket.to(roomId).emit('other_enter', loggedInUserId);

    // roomId에 해당하는 기존 채팅 메시지가 있는 경우 검색하고 내보냄
    const messages = await prisma.chatMessage.findMany({
      where: { roomId },
    });

    console.log('이전 메시지 내용: ', messages ? messages : '이전메시지없음');

    socket.emit('messages', messages);
  });

  socket.on('sendMessage', async (otherUserId, message) => {
    // 마찬가지로 나와 상대방 ID를 기반으로 룸 ID를 만든 다음 보낼 메시지를 데이터베이스에 저장하고 상대방에게 보낸다.
    const roomId = `chat_${Math.min(loggedInUserId, otherUserId)}_${Math.max(
      loggedInUserId,
      otherUserId,
    )}`;

    console.log(message);

    await prisma.chatMessage.create({
      data: {
        roomId,
        message,
        senderId: loggedInUserId,
      },
    });

    console.log('메시지 저장 성공');
    // 상대방에게 브로드캐스팅
    socket.to(roomId).emit('message', { senderId: loggedInUserId, message });
  });

  socket.on('leaveRoom', async (otherUserId) => {
    const roomId = `chat_${Math.min(loggedInUserId, otherUserId)}_${Math.max(
      loggedInUserId,
      otherUserId,
    )}`;

    // 사용자가 방을 나가면, 해당 방과 속해있는 메시지를 데이터베이스에서 삭제한다
    await prisma.chatMessage.deleteMany({
      where: { roomId },
    });
    await prisma.chatRoom.delete({
      where: { id: roomId },
    });
    socket.leave(roomId);
  });

  socket.on('messageViewed', async (messageId) => {
    // isRead 를 true로 업데이트
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${loggedInUserId} disconnected`);
  });
});

app.io = io;

/** @description 프로세스 종료 후 프리즈마 연결해제 */
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

module.exports = { app };
