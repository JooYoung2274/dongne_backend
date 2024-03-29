import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { UserRepository } from '../user/user.repository';
import { ChatRecordRepository } from '../chat-room/chat-record.repository';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private userRepository: UserRepository,
    private chatRecordRepository: ChatRecordRepository,
  ) {}
  @WebSocketServer() public server: Server;

  @SubscribeMessage('joinRoom')
  async handleLogin(
    @MessageBody() data: { id: number; roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // 방에 들어갈 때
    console.log(socket['dongneData']);
    socket['dongneData']['userId'] = data.id;
    socket['dongneData']['roomId'] = data.roomId;

    // 조인룸 시켜버림
    socket.join(data.roomId);

    // 방에 들어갔다고 알려줌
    socket.emit('joinRoom', data.roomId);

    // 방에 있는 인원들에게 새로운 사람 들어왔다고 알려줌
    // 유저정보 찾아서 보내줘야함
    const isUser = await this.userRepository.findOne({
      where: { id: data.id },
    });
    const message = `${isUser.nickname}님이 입장하셨습니다.`;

    socket.to(data.roomId).emit('joinRoom', {
      message: message,
      userProfile: isUser.profileImage,
    });
    console.log('login', socket['dongneData']);
  }

  @SubscribeMessage('chatting')
  async andleChat(
    @MessageBody() data: { message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const roomId = socket['dongneData'].roomId;

    // 채팅기록 db에 저장해야함
    await this.chatRecordRepository.createChatRecord(
      Number(roomId),
      data.message,
      socket['dongneData'].userId,
    );

    socket.to(roomId).emit('chatting', data);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { id: number; roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // 룸에서 나가버림
    socket.leave(data.roomId);
    const dongneData = {
      userId: null,
      roomId: null,
    };
    console.log('leaveRoom', (socket['dongneData'] = dongneData));
    // 방에 있는 인원들에게 알려줌
    // 유저정보 찾아서 보내줘야함
    const isUser = await this.userRepository.findOne({
      where: { id: data.id },
    });
    const message = `${isUser.nickname}님이 퇴장하셨습니다.`;

    socket.to(data.roomId).emit('leaveRoom', {
      message: message,
      userProfile: isUser.profileImage,
    });
  }

  @SubscribeMessage('reJoinRoom')
  async handleReJoinRoom(
    @MessageBody() data: { id: number; roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // 방에 들어갈 때
    socket['dongneData'].userId = data.id;
    socket['dongneData'].roomId = data.roomId;

    // 조인룸 시켜버림
    socket.join(data.roomId);

    // 이전 채팅 기록도 리턴해버림
    const chatRecord = await this.chatRecordRepository.find({
      where: { ChatId: Number(data.roomId) },
    });

    // 방에 들어갔다고 알려줌
    socket.emit('reJoinRoom', { roomId: data.roomId, chatRecord: chatRecord });
    console.log('reJoinRoom', socket['dongneData']);
  }
  afterInit() {
    console.log('소켓서버 init');
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    const dongneData = {
      userId: null,
      roomId: null,
    };
    console.log('connected', (socket['dongneData'] = dongneData));
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('disconnected', socket['dongneData']);
  }
}
