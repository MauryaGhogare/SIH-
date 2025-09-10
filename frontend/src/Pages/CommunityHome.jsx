import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faExclamationTriangle,
  faPaperPlane,
  faUser,
  faThumbsUp,
  faComment,
  faReply,
  faCheckCircle,
  faClock,
  faMapMarkerAlt,
  faSearch,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { Navbar } from '../componets/navbar';
import { Footer } from '../componets/footer';
import { useLanguage } from '../stores/useLanguage';
import { communityTranslations } from '../translations/communityTranslations';

const CommunityHome = () => {
  const { language } = useLanguage();
  const t = communityTranslations[language] || communityTranslations.Eng;
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [isPosting, setIsPosting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState({
    id: 'u1',
    name: 'Ramesh Kumar',
    role: 'farmer'
  });

  const categories = [
    t.categories.General,
    t.categories.Planting,
    t.categories.Pests,
    t.categories.Irrigation,
    t.categories.Harvest,
    t.categories.Equipment,
    t.categories.Weather,
    t.categories.QA
  ];

  // Mock data for posts
  const mockPosts = [
    {
      id: 'p1',
      authorId: 'u1',
      authorName: 'Ramesh Kumar',
      title: 'When to sow rabi wheat?',
      content: 'Is late October okay for sowing rabi wheat in Punjab? What are the ideal conditions?',
      category: 'Planting',
      tags: ['wheat', 'rabi', 'sowing'],
      location: { state: 'Punjab' },
      upvotes: 6,
      answersCount: 3,
      createdAt: '2025-01-08T08:00:00Z',
      isAnswered: false,
      replies: [
        {
          id: 'r1',
          authorId: 'u2',
          authorName: 'Sita Devi',
          content: 'Late October is perfect for rabi wheat in Punjab. Make sure soil temperature is around 15-20°C.',
          createdAt: '2025-01-08T10:00:00Z',
          upvotes: 2
        },
        {
          id: 'r2',
          authorId: 'u3',
          authorName: 'Dr. Singh',
          content: 'Yes, October 15-30 is ideal. Ensure proper irrigation and use certified seeds.',
          createdAt: '2025-01-08T12:00:00Z',
          upvotes: 4
        }
      ]
    },
    {
      id: 'p2',
      authorId: 'u2',
      authorName: 'Sita Devi',
      title: 'Pest: brown spots on mango leaves',
      content: 'I\'m seeing brown spots on my mango tree leaves. The spots are spreading quickly. What could be causing this and how to treat it?',
      category: 'Pests',
      tags: ['mango', 'pests', 'disease'],
      location: { state: 'Maharashtra' },
      upvotes: 3,
      answersCount: 1,
      createdAt: '2025-01-07T12:00:00Z',
      isAnswered: true,
      replies: [
        {
          id: 'r3',
          authorId: 'u3',
          authorName: 'Dr. Singh',
          content: 'This looks like anthracnose. Apply copper-based fungicide and ensure proper drainage.',
          createdAt: '2025-01-07T14:00:00Z',
          upvotes: 5
        }
      ]
    },
    {
      id: 'p3',
      authorId: 'u3',
      authorName: 'Dr. Singh',
      title: 'Best irrigation practices for rice',
      content: 'What are the most efficient irrigation methods for rice cultivation? Looking for water-saving techniques.',
      category: 'Irrigation',
      tags: ['rice', 'irrigation', 'water-saving'],
      location: { state: 'West Bengal' },
      upvotes: 8,
      answersCount: 2,
      createdAt: '2025-01-06T09:00:00Z',
      isAnswered: false,
      replies: [
        {
          id: 'r4',
          authorId: 'u1',
          authorName: 'Ramesh Kumar',
          content: 'Try alternate wetting and drying (AWD) method. It saves 30% water without affecting yield.',
          createdAt: '2025-01-06T11:00:00Z',
          upvotes: 3
        }
      ]
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setIsPosting(true);
    
    // Simulate posting delay
    setTimeout(() => {
      const post = {
        id: `p${Date.now()}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        tags: [],
        location: { state: 'Current Location' },
        upvotes: 0,
        answersCount: 0,
        createdAt: new Date().toISOString(),
        isAnswered: false,
        replies: []
      };
      
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: '', content: '', category: 'General' });
      setIsPosting(false);
    }, 1000);
  };

  const handleUpvote = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, upvotes: post.upvotes + 1 }
        : post
    ));
  };

  const handleReply = (postId, replyContent) => {
    if (!replyContent.trim()) return;
    
    const reply = {
      id: `r${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      content: replyContent,
      createdAt: new Date().toISOString(),
      upvotes: 0
    };
    
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            replies: [...post.replies, reply],
            answersCount: post.answersCount + 1
          }
        : post
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Planting': '#dbeafe',
      'Pests': '#fee2e2',
      'Irrigation': '#dbeafe',
      'Harvest': '#fef3c7',
      'Equipment': '#f3f4f6',
      'Weather': '#e0f2fe',
      'Q&A': '#f3e8ff',
      'General': '#dcfce7'
    };
    return colors[category] || colors['General'];
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      'Planting': '#1e40af',
      'Pests': '#dc2626',
      'Irrigation': '#1e40af',
      'Harvest': '#d97706',
      'Equipment': '#374151',
      'Weather': '#0369a1',
      'Q&A': '#7c3aed',
      'General': '#166534'
    };
    return colors[category] || colors['General'];
  };

  if (loading) {
    return (
      <div className="community-page">
        <div className="community-container">
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-spinner" />
            <h3>Loading Community Posts...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="community-page">
        <div className="community-container">
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <h3>Error Loading Posts</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community-page">
      <Navbar />
      
      {/* Header */}
      <div className="community-header">
        <div className="community-container">
          <div className="header-content">
            <h1>Need help? We've got your back.</h1>
            <p>Find advice and answers for everything</p>
          </div>
          
          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="community-container">
        {/* Quick Post Form */}
        <div className="quick-post-box">
          <form onSubmit={handlePostSubmit} className="post-form">
            <div className="form-header">
              <h3>Share Your Question or Experience</h3>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                placeholder="What's your question or topic?"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Description</label>
              <textarea
                id="content"
                placeholder="Describe your question or share your experience..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={3}
                maxLength={1000}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                disabled={isPosting}
                className="submit-btn"
              >
                {isPosting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>Post Question</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="results-section">
          <div className="results-header">
            <h3>Community Posts ({posts.length})</h3>
          </div>

          {posts.length === 0 ? (
            <div className="no-results">
              <FontAwesomeIcon icon={faComment} />
              <h3>No posts yet</h3>
              <p>Be the first to share something with the community!</p>
            </div>
          ) : (
            <div className="posts-container">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  {/* Post Header */}
                  <div className="post-header">
                    <div className="post-author">
                      <div className="author-avatar">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div className="author-info">
                        <h4>{post.authorName}</h4>
                        <div className="post-meta">
                          <FontAwesomeIcon icon={faClock} />
                          <span>{formatDate(post.createdAt)}</span>
                          {post.location && (
                            <>
                              <FontAwesomeIcon icon={faMapMarkerAlt} />
                              <span>{post.location.state}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="post-category">
                      <span 
                        style={{ 
                          background: getCategoryColor(post.category),
                          color: getCategoryTextColor(post.category)
                        }}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-body">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="post-footer">
                    <div className="post-stats">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className="stat-btn upvote-btn"
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{post.upvotes}</span>
                      </button>
                      
                      <div className="stat-btn comment-btn">
                        <FontAwesomeIcon icon={faComment} />
                        <span>{post.answersCount}</span>
                      </div>
                    </div>
                    
                    {post.isAnswered && (
                      <div className="answered-badge">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span>Answered</span>
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {post.replies.length > 0 && (
                    <div className="replies-section">
                      <h4>Replies ({post.replies.length})</h4>
                      {post.replies.map(reply => (
                        <div key={reply.id} className="reply-card">
                          <div className="reply-header">
                            <div className="reply-author">
                              <FontAwesomeIcon icon={faUser} className="reply-avatar" />
                              <span className="reply-author-name">{reply.authorName}</span>
                            </div>
                            <span className="reply-date">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="reply-content">{reply.content}</p>
                          <div className="reply-actions">
                            <button className="reply-upvote-btn">
                              <FontAwesomeIcon icon={faThumbsUp} />
                              <span>{reply.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="reply-form">
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const replyContent = e.target.reply.value;
                      handleReply(post.id, replyContent);
                      e.target.reply.value = '';
                    }}>
                      <div className="reply-input-group">
                        <textarea
                          name="reply"
                          placeholder="Write your reply..."
                          rows={2}
                          required
                        />
                        <button type="submit" className="reply-submit-btn">
                          <FontAwesomeIcon icon={faReply} />
                          Reply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CommunityHome;