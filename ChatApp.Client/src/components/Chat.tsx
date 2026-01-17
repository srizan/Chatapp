import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { Message, ChatConfig } from '../types/chat.types';
import { useAuth } from '../hooks/useAuth';
import './Chat.css';

const config: ChatConfig = {
  apiUrl: 'http://localhost:5296/api',
  hubUrl: 'http://localhost:5296/chathub',
};

function Chat() {
  const { user, logout } = useAuth();
  const [connection, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };
    loadMessages();
  }, []);

 useEffect(() => {
  if (!user) return;

  let isMounted = true;
  let hubConnection: signalR.HubConnection | null = null;

  const connectToHub = async () => {
    try {
      hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(config.hubUrl, {
          accessTokenFactory: () => user.token
        })
        .withAutomaticReconnect()
        .build();

      hubConnection.on('ReceiveMessage', (username: string, message: string, sentAt: string) => {
        if (!isMounted) return;
        
        const newMessage: Message = {
          user: { username },
          content: message,
          sentAt: sentAt
        };
        setMessages(prev => [...prev, newMessage]);
      });

      hubConnection.on('UserJoined', (joinedUser: string) => {
        console.log(`${joinedUser} joined the chat`);
      });

      await hubConnection.start();
      console.log('Connected to SignalR hub');
      
      if (isMounted) {
        setConnection(hubConnection);
      }
    } catch (error) {
      console.error('Error connecting to hub:', error);
    }
  };

  connectToHub();

  return () => {
    isMounted = false;
    if (hubConnection) {
      hubConnection.off('ReceiveMessage');
      hubConnection.off('UserJoined');
      hubConnection.stop();
    }
  };
}, [user]);

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!currentMessage.trim() || !connection || !user) return;

    try {
      await connection.invoke('SendMessage', currentMessage);
      setCurrentMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleMessageChange = (e: ChangeEvent): void => {
    setCurrentMessage(e.target.value);
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
  return <div>Loading...</div>;
}

return (
  <div className="chat-container">
    <div className="chat-header">
      <h2>💬 Chat Room</h2>
      <div className="header-user-info">👤
        {user.profilePictureUrl && (
          <img src="{user.profilePictureUrl}" alt={user.username} className="user-avatar" />
        )}
        <span className="username-badge" title={user.email}>        
          <strong>{user.username}</strong>
          <u>{user.email}</u>
         </span>
         <span>{user.profilePictureUrl}</span>
        <button onClick={logout} className="logout-btn">Logout</button>        
      </div>
    </div>

    <div className="messages-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.user?.username === user.username ? 'own-message' : 'other-message'}`}
        >
          <div className="message-header">
            {/* <span className="message-user">{msg.user?.username || 'Unknown'}</span> */}
            <span className="message-user">{msg.user?.email || 'Unknown'}</span>
            <span className="message-time">{formatTime(msg.sentAt)}</span>
          </div>
          <div className="message-content">{msg.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>

    <form onSubmit={handleSendMessage} className="message-input-container">
      <input
        type="text"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={handleMessageChange}
        className="message-input"
      />
      <button type="submit" className="send-btn">
        Send
      </button>
    </form>
  </div>
);
}

export default Chat;