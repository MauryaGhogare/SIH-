import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faUser,
  faPaperPlane,
  faSpinner,
  faExclamationTriangle,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import communityAPI from '../api/community';

const ChatWindow = () => {
  const { id } = useParams();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentUser] = useState({
    id: 'u1',
    name: 'Ramesh Kumar'
  });

  useEffect(() => {
    loadChatAndMessages();
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatAndMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [chatResult, messagesResult] = await Promise.all([
        communityAPI.getChats(currentUser.id),
        communityAPI.getMessages(id)
      ]);
      
      if (chatResult.success && messagesResult.success) {
        const currentChat = chatResult.data.find(c => c.id === id);
        if (currentChat) {
          setChat(currentChat);
          setMessages(messagesResult.data);
        } else {
          throw new Error('Chat not found');
        }
      } else {
        throw new Error('Failed to load chat or messages');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;
    
    setIsSending(true);
    
    try {
      const messageData = {
        content: newMessage.trim(),
        senderId: currentUser.id
      };
      
      const result = await communityAPI.sendMessage(id, messageData);
      
      if (result.success) {
        setMessages(prev => [...prev, result.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = () => {
    if (!chat) return null;
    return chat.participants.find(participantId => participantId !== currentUser.id);
  };

  const getParticipantName = (participantId) => {
    const names = {
      'u1': 'Ramesh Kumar',
      'u2': 'Sita Devi',
      'u3': 'Dr. Rajesh Agrawal'
    };
    return names[participantId] || 'Unknown User';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (error || !chat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The chat you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/community/chat"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/community/chat"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back</span>
              </Link>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-green-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {getParticipantName(otherParticipant)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {otherParticipant === 'u3' ? 'Agricultural Expert' : 'Farmer'}
                  </p>
                </div>
              </div>
            </div>
            
            <button className="text-gray-400 hover:text-gray-600">
              <FontAwesomeIcon icon={faEllipsisV} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FontAwesomeIcon icon={faPaperPlane} className="text-3xl mb-2" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === currentUser.id
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === currentUser.id
                          ? 'text-green-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSending ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} />
                )}
              </button>
            </form>
            <p className="text-gray-400 text-xs mt-1">{newMessage.length}/500</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
