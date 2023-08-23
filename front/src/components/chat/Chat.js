import React, { useState, useEffect } from 'react';
import useWebSocket from './useWebSocket';
import styles from './layout.module.scss';

function Chat({ loggedInUserId, otherUserId }) {
  const [messages, setMessages] = useState([]); // 받은 채팅 메시지를 저장함
  const [messageText, setMessageText] = useState(''); // 메시지 input값을 저장

  // 웹 소켓을 연결함
  const socket = useWebSocket('ws://your-websocket-server-url');

  useEffect(() => {
    if (!socket) return; // 웹 소켓 연결 실패 혹은 없을 시 종료함

    // 초기 메시지들을 받음
    socket.on('messages', (receivedMessages) => {
      setMessages(receivedMessages);
    });

    // 새로운 메시지를 받음
    socket.on('message', (newMessage) => {
      // 기존 메시지리스트에 받은 메시지를 추가함
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // 컴포넌트를 나가면 방을 나감
      socket.emit('leaveRoom', otherUserId);
    };
  }, [socket, otherUserId]);

  // 클라에서 메시지를 전송하는 함수
  const sendMessage = () => {
    if (!socket || !messageText.trim()) return; // 연결이 실패 및 없음 혹은 빈 메시지면 종료함

    // 메시지를 서버에 전송
    socket.emit('sendMessage', otherUserId, messageText);

    // 전송 후 input을 초기화함
    setMessageText('');
  };

  return (
    <div className={styles.chat}>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.senderId === loggedInUserId
              ? '나의 메시지: '
              : `${otherUserId}의 메시지: `}
            {message.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button className="gBtn" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}

export default Chat;