import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faComment,
  faMapMarkerAlt,
  faTag,
  faCheckCircle,
  faUser,
  faClock,
  faFlag,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import communityAPI from '../../api/community';

const PostCard = ({ post, currentUser, onUpvote, onReport }) => {
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const handleUpvote = async () => {
    if (isUpvoting) return;
    
    setIsUpvoting(true);
    try {
      await communityAPI.upvotePost(post.id, currentUser?.id || 'u1');
      if (onUpvote) {
        onUpvote(post.id);
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleReport = async () => {
    try {
      await communityAPI.reportPost(post.id, reportReason);
      setShowReportModal(false);
      setReportReason('');
      if (onReport) {
        onReport(post.id);
      }
      showNotification('Post reported successfully', 'success');
    } catch (error) {
      console.error('Error reporting post:', error);
      showNotification('Failed to report post', 'error');
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

  const getCategoryColor = (category) => {
    const colors = {
      'Planting': 'bg-blue-100 text-blue-800',
      'Pests': 'bg-red-100 text-red-800',
      'Irrigation': 'bg-blue-100 text-blue-800',
      'Harvest': 'bg-yellow-100 text-yellow-800',
      'Equipment': 'bg-gray-100 text-gray-800',
      'Weather': 'bg-sky-100 text-sky-800',
      'Q&A': 'bg-purple-100 text-purple-800',
      'General': 'bg-green-100 text-green-800'
    };
    return colors[category] || colors['General'];
  };

  return (
    <>
      <div className="post-card">
        {/* Header */}
        <div className="post-header">
          <div className="post-author">
            <div className="author-avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="author-info">
              <h4>Author</h4>
              {post.authorId === 'u3' && (
                <span className="author-badge">Expert</span>
              )}
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
          
          <div className="post-actions">
            <button
              onClick={() => setShowReportModal(true)}
              className="post-action-btn"
              title="Report post"
            >
              <FontAwesomeIcon icon={faFlag} />
            </button>
            <button className="post-action-btn">
              <FontAwesomeIcon icon={faShare} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="post-content">
          <Link 
            to={`/community/post/${post.id}`}
            className="post-title"
          >
            {post.title}
          </Link>
          
          <p className="post-body line-clamp-3">
            {post.body}
          </p>
          
          {post.imageUrl && (
            <div className="post-image">
              <img 
                src={post.imageUrl} 
                alt="Post image" 
                loading="lazy"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span 
                key={index}
                className="post-tag"
              >
                <FontAwesomeIcon icon={faTag} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Category */}
        <div className="post-category">
          <span className={`category-${post.category.toLowerCase()}`}>
            {post.category}
          </span>
        </div>

        {/* Actions */}
        <div className="post-footer">
          <div className="post-stats">
            <button
              onClick={handleUpvote}
              disabled={isUpvoting}
              className="stat-btn upvote-btn"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>{post.upvotes}</span>
            </button>
            
            <Link
              to={`/community/post/${post.id}`}
              className="stat-btn comment-btn"
            >
              <FontAwesomeIcon icon={faComment} />
              <span>{post.answersCount}</span>
            </Link>
          </div>
          
          <div className="post-status">
            {post.isAnswered && (
              <div className="answered-badge">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Answered</span>
              </div>
            )}
            
            <Link
              to={`/community/post/${post.id}`}
              className="view-details-btn"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Report Post</h3>
            <p className="text-gray-600 mb-4">Why are you reporting this post?</p>
            
            <div className="space-y-2 mb-4">
              {[
                'Spam',
                'Inappropriate content',
                'Misinformation',
                'Harassment',
                'Other'
              ].map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="mr-2"
                  />
                  {reason}
                </label>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
