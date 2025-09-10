import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMessage,
  faUser,
  faClock,
  faSearch,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import communityAPI from '../api/community';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser] = useState({
    id: 'u1',
    name: 'Ramesh Kumar'
  });

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await communityAPI.getChats(currentUser.id);
      
      if (result.success) {
        setChats(result.data);
      } else {
        throw new Error('Failed to load chats');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(id => id !== currentUser.id);
  };

  const filteredChats = chats.filter(chat => {
    if (!searchTerm) return true;
    const otherParticipant = getOtherParticipant(chat);
    return chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
          <p className="text-gray-600">Loading chats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Chats</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadChats}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Connect with fellow farmers and experts</p>
            </div>
            <Link
              to="/community"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Back to Community
            </Link>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faMessage} className="text-4xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start a conversation by commenting on posts or reaching out to other farmers.'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/community"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Browse Community Posts
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChats.map(chat => {
              const otherParticipant = getOtherParticipant(chat);
              return (
                <Link
                  key={chat.id}
                  to={`/community/chat/${chat.id}`}
                  className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faUser} className="text-green-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {otherParticipant === 'u3' ? 'Dr. Rajesh Agrawal' : 'Farmer'}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {formatDate(chat.lastMessageAt)}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 truncate">
                        {chat.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
