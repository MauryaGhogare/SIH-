import communityData from '../mocks/community.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API for community features
export const communityAPI = {
  // Posts
  async getPosts(filters = {}) {
    await delay(500);
    let posts = [...communityData.posts];
    
    // Apply filters
    if (filters.category) {
      posts = posts.filter(post => post.category === filters.category);
    }
    if (filters.tags && filters.tags.length > 0) {
      posts = posts.filter(post => 
        filters.tags.some(tag => post.tags.includes(tag))
      );
    }
    if (filters.location) {
      posts = posts.filter(post => 
        post.location.state.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Sort by different criteria
    switch (filters.sortBy) {
      case 'trending':
        posts.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'recent':
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'nearby':
        // Mock nearby sorting (would use actual location in real app)
        posts.sort((a, b) => Math.random() - 0.5);
        break;
      default:
        posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    return {
      success: true,
      data: posts,
      total: posts.length
    };
  },

  async getPost(id) {
    await delay(300);
    const post = communityData.posts.find(p => p.id === id);
    if (!post) {
      throw new Error('Post not found');
    }
    return { success: true, data: post };
  },

  async createPost(postData) {
    await delay(800);
    const newPost = {
      id: `p${Date.now()}`,
      ...postData,
      upvotes: 0,
      answersCount: 0,
      isAnswered: false,
      acceptedAnswerId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reports: 0
    };
    
    // Add to mock data
    communityData.posts.unshift(newPost);
    
    return { success: true, data: newPost };
  },

  async upvotePost(postId, userId) {
    await delay(300);
    const post = communityData.posts.find(p => p.id === postId);
    if (post) {
      post.upvotes += 1;
    }
    return { success: true, data: post };
  },

  // Comments
  async getComments(postId) {
    await delay(300);
    const comments = communityData.comments.filter(c => c.postId === postId);
    return { success: true, data: comments };
  },

  async addComment(postId, commentData) {
    await delay(500);
    const newComment = {
      id: `a${Date.now()}`,
      postId,
      ...commentData,
      upvotes: 0,
      createdAt: new Date().toISOString(),
      isAccepted: false,
      replies: []
    };
    
    communityData.comments.push(newComment);
    
    // Update post answer count
    const post = communityData.posts.find(p => p.id === postId);
    if (post) {
      post.answersCount += 1;
    }
    
    return { success: true, data: newComment };
  },

  async acceptAnswer(postId, commentId) {
    await delay(300);
    const post = communityData.posts.find(p => p.id === postId);
    const comment = communityData.comments.find(c => c.id === commentId);
    
    if (post && comment) {
      // Unaccept previous answer
      if (post.acceptedAnswerId) {
        const prevAnswer = communityData.comments.find(c => c.id === post.acceptedAnswerId);
        if (prevAnswer) prevAnswer.isAccepted = false;
      }
      
      // Accept new answer
      post.acceptedAnswerId = commentId;
      post.isAnswered = true;
      comment.isAccepted = true;
    }
    
    return { success: true, data: { post, comment } };
  },

  // Users
  async getUsers() {
    await delay(200);
    return { success: true, data: communityData.users };
  },

  async getUser(id) {
    await delay(200);
    const user = communityData.users.find(u => u.id === id);
    return { success: true, data: user };
  },

  // Chats
  async getChats(userId) {
    await delay(300);
    const userChats = communityData.chats.filter(chat => 
      chat.participants.includes(userId)
    );
    return { success: true, data: userChats };
  },

  async getMessages(chatId) {
    await delay(200);
    const messages = communityData.messages.filter(m => m.chatId === chatId);
    return { success: true, data: messages };
  },

  async sendMessage(chatId, messageData) {
    await delay(400);
    const newMessage = {
      id: `m${Date.now()}`,
      chatId,
      ...messageData,
      createdAt: new Date().toISOString()
    };
    
    communityData.messages.push(newMessage);
    
    // Update chat last message
    const chat = communityData.chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = messageData.content;
      chat.lastMessageAt = newMessage.createdAt;
    }
    
    return { success: true, data: newMessage };
  },

  async startChat(userId1, userId2) {
    await delay(300);
    const existingChat = communityData.chats.find(chat => 
      chat.participants.includes(userId1) && chat.participants.includes(userId2)
    );
    
    if (existingChat) {
      return { success: true, data: existingChat };
    }
    
    const newChat = {
      id: `c${Date.now()}`,
      participants: [userId1, userId2],
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0
    };
    
    communityData.chats.push(newChat);
    return { success: true, data: newChat };
  },

  // Notifications
  async getNotifications(userId) {
    await delay(200);
    const notifications = communityData.notifications.filter(n => n.userId === userId);
    return { success: true, data: notifications };
  },

  async markNotificationRead(notificationId) {
    await delay(200);
    const notification = communityData.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
    return { success: true, data: notification };
  },

  // Moderation
  async reportPost(postId, reason) {
    await delay(300);
    const post = communityData.posts.find(p => p.id === postId);
    if (post) {
      post.reports += 1;
    }
    return { success: true, data: post };
  },

  async getReportedPosts() {
    await delay(300);
    const reportedPosts = communityData.posts.filter(p => p.reports > 0);
    return { success: true, data: reportedPosts };
  },

  // Drafts (localStorage)
  saveDraft(key, data) {
    try {
      localStorage.setItem(`community_draft_${key}`, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getDraft(key) {
    try {
      const draft = localStorage.getItem(`community_draft_${key}`);
      return { success: true, data: draft ? JSON.parse(draft) : null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  clearDraft(key) {
    try {
      localStorage.removeItem(`community_draft_${key}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default communityAPI;
