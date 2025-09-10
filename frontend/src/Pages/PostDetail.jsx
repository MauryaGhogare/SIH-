import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faThumbsUp,
  faComment,
  faCheckCircle,
  faUser,
  faClock,
  faMapMarkerAlt,
  faTag,
  faFlag,
  faShare,
  faSpinner,
  faExclamationTriangle,
  faReply,
  faMessage
} from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import communityAPI from '../api/community';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser] = useState({
    id: 'u1',
    name: 'Ramesh Kumar',
    role: 'farmer'
  });
  
  // Comment form
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPostAndComments();
  }, [id]);

  const loadPostAndComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [postResult, commentsResult] = await Promise.all([
        communityAPI.getPost(id),
        communityAPI.getComments(id)
      ]);
      
      if (postResult.success && commentsResult.success) {
        setPost(postResult.data);
        setComments(commentsResult.data);
      } else {
        throw new Error('Failed to load post or comments');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      await communityAPI.upvotePost(post.id, currentUser.id);
      setPost(prev => ({ ...prev, upvotes: prev.upvotes + 1 }));
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleAcceptAnswer = async (commentId) => {
    try {
      await communityAPI.acceptAnswer(post.id, commentId);
      setPost(prev => ({ ...prev, acceptedAnswerId: commentId, isAnswered: true }));
      setComments(prev => prev.map(comment => ({
        ...comment,
        isAccepted: comment.id === commentId
      })));
      showNotification('Answer accepted!', 'success');
    } catch (error) {
      console.error('Error accepting answer:', error);
      showNotification('Failed to accept answer', 'error');
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const commentData = {
        body: newComment.trim(),
        authorId: currentUser.id,
        replyingTo: replyingTo
      };
      
      const result = await communityAPI.addComment(post.id, commentData);
      
      if (result.success) {
        setComments(prev => [...prev, result.data]);
        setNewComment('');
        setReplyingTo(null);
        showNotification('Comment added!', 'success');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      showNotification('Failed to add comment', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartChat = async (userId) => {
    try {
      const result = await communityAPI.startChat(currentUser.id, userId);
      if (result.success) {
        navigate(`/community/chat/${result.data.id}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-green-600 mb-4" />
          <p className="text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Post Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The post you\'re looking for doesn\'t exist.'}</p>
          <Link
            to="/community"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/community"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back to Community</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-green-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-semibold text-gray-900">Author</h4>
                  {post.authorId === 'u3' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Expert
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
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
            
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <FontAwesomeIcon icon={faFlag} />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <FontAwesomeIcon icon={faShare} />
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-700 leading-relaxed">{post.body}</p>
            
            {post.imageUrl && (
              <div className="mt-4">
                <img 
                  src={post.imageUrl} 
                  alt="Post image" 
                  className="w-full max-w-2xl rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  <FontAwesomeIcon icon={faTag} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleUpvote}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>{post.upvotes}</span>
              </button>
              
              <div className="flex items-center space-x-2 px-4 py-2 text-gray-600">
                <FontAwesomeIcon icon={faComment} />
                <span>{post.answersCount}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {post.isAnswered && (
                <div className="flex items-center space-x-1 text-green-600">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span className="text-sm font-medium">Answered</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Answers & Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="space-y-4">
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? `Reply to comment...` : "Share your answer or comment..."}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  maxLength={1000}
                />
                <p className="text-gray-400 text-sm mt-1">{newComment.length}/1000</p>
              </div>
              
              <div className="flex justify-between items-center">
                {replyingTo && (
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel reply
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faComment} />
                      <span>Post Comment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FontAwesomeIcon icon={faComment} className="text-3xl mb-2" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div 
                  key={comment.id}
                  className={`p-4 rounded-lg border ${
                    comment.isAccepted 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-blue-600 text-sm" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Commenter</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {comment.isAccepted && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span className="text-sm font-medium">Accepted</span>
                        </div>
                      )}
                      
                      {post.authorId === currentUser.id && !comment.isAccepted && !post.isAnswered && (
                        <button
                          onClick={() => handleAcceptAnswer(comment.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Accept Answer
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{comment.body}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600">
                        <FontAwesomeIcon icon={faThumbsUp} />
                        <span>{comment.upvotes}</span>
                      </button>
                      
                      <button
                        onClick={() => setReplyingTo(comment.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                      >
                        <FontAwesomeIcon icon={faReply} />
                        <span>Reply</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleStartChat(comment.authorId)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
                    >
                      <FontAwesomeIcon icon={faMessage} />
                      <span>Chat</span>
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-8 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <FontAwesomeIcon icon={faUser} className="text-gray-600 text-xs" />
                            </div>
                            <span className="font-medium text-gray-900">Replier</span>
                            <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-700">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
