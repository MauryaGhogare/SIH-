import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faLocationDot,
  faTag,
  faPaperPlane,
  faSpinner,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import communityAPI from '../../api/community';

const QuickPostBox = ({ onPostCreated, currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'General',
    tags: '',
    location: '',
    image: null
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const categories = [
    'General',
    'Planting',
    'Pests',
    'Irrigation',
    'Harvest',
    'Equipment',
    'Weather',
    'Q&A'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Auto-save draft
    communityAPI.saveDraft('new_post', { ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.body.trim()) {
      newErrors.body = 'Description is required';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    if (formData.body.length > 1000) {
      newErrors.body = 'Description must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData = {
        title: formData.title.trim(),
        body: formData.body.trim(),
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        location: formData.location ? { state: formData.location } : null,
        authorId: currentUser?.id || 'u1', // Default user for demo
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : null
      };
      
      const result = await communityAPI.createPost(postData);
      
      if (result.success) {
        // Clear form
        setFormData({
          title: '',
          body: '',
          category: 'General',
          tags: '',
          location: '',
          image: null
        });
        setIsExpanded(false);
        setErrors({});
        
        // Clear draft
        communityAPI.clearDraft('new_post');
        
        // Notify parent component
        if (onPostCreated) {
          onPostCreated(result.data);
        }
        
        // Show success message
        showNotification('Post created successfully!', 'success');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showNotification('Failed to create post. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type) => {
    // Simple notification - in real app, use toast library
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

  const loadDraft = () => {
    const draft = communityAPI.getDraft('new_post');
    if (draft.success && draft.data) {
      setFormData(draft.data);
      setIsExpanded(true);
    }
  };

  return (
    <div className="quick-post-box">
      {!isExpanded ? (
        <div 
          className="post-trigger"
          onClick={() => setIsExpanded(true)}
        >
          <div className="post-trigger-icon">
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
          <div className="post-trigger-text">
            Share your farming experience or ask a question...
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-header">
            <h3>Create New Post</h3>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="close-btn"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="What's your question or topic?"
              value={formData.title}
              onChange={handleInputChange}
              maxLength={100}
            />
            {errors.title && (
              <p className="error-message">{errors.title}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">{formData.title.length}/100</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="body">Description</label>
            <textarea
              name="body"
              placeholder="Describe your question or share your experience..."
              value={formData.body}
              onChange={handleInputChange}
              rows={4}
              maxLength={1000}
            />
            {errors.body && (
              <p className="error-message">{errors.body}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">{formData.body.length}/1000</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FontAwesomeIcon icon={faTag} className="mr-1" />
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                placeholder="e.g., wheat, irrigation, pest"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
              Location (optional)
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g., Punjab, Maharashtra"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FontAwesomeIcon icon={faImage} className="mr-1" />
              Image (optional)
            </label>
            <div className="flex items-center space-x-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Choose Image
              </button>
              {formData.image && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{formData.image.name}</span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={loadDraft}
              className="draft-btn"
            >
              Load Draft
            </button>
            
            <div className="action-buttons">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    <span>Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default QuickPostBox;
