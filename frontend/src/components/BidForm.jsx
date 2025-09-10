import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShoppingCart, faUser, faEnvelope, faPhone, faRupeeSign, faWeight } from '@fortawesome/free-solid-svg-icons';
import biddingService from '../services/biddingService';

const BidForm = ({ farmer, isOpen, onClose, onBidPlaced }) => {
  const [formData, setFormData] = useState({
    bidderName: '',
    bidderEmail: '',
    bidderPhone: '',
    bidPrice: '',
    quantity: '1',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bidData = {
        farmerId: farmer.id,
        farmerName: farmer.name,
        cropName: farmer.mainCrop,
        farmerImage: farmer.image,
        farmName: farmer.farmName,
        location: farmer.location,
        ...formData,
        bidPrice: parseFloat(formData.bidPrice) || 0
      };

      const newBid = biddingService.placeBid(bidData);
      
      // Reset form
      setFormData({
        bidderName: '',
        bidderEmail: '',
        bidderPhone: '',
        bidPrice: '',
        quantity: '1',
        message: ''
      });

      // Notify parent component
      if (onBidPlaced) {
        onBidPlaced(newBid);
      }

      // Close modal
      onClose();
    } catch (error) {
      console.error('Error placing bid:', error);
      biddingService.showNotification('Error placing bid. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bid-form-overlay" onClick={onClose}>
      <div className="bid-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bid-form-header">
          <h3>Place Bid for {farmer.mainCrop}</h3>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="farmer-info-summary">
          <img src={farmer.image} alt={farmer.name} />
          <div>
            <h4>{farmer.name}</h4>
            <p>{farmer.farmName}, {farmer.location}</p>
            <p><strong>Crop:</strong> {farmer.mainCrop}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bid-form">
          <div className="form-group">
            <label htmlFor="bidderName">
              <FontAwesomeIcon icon={faUser} />
              Your Name *
            </label>
            <input
              type="text"
              id="bidderName"
              name="bidderName"
              value={formData.bidderName}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bidderEmail">
              <FontAwesomeIcon icon={faEnvelope} />
              Email Address *
            </label>
            <input
              type="email"
              id="bidderEmail"
              name="bidderEmail"
              value={formData.bidderEmail}
              onChange={handleInputChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bidderPhone">
              <FontAwesomeIcon icon={faPhone} />
              Phone Number *
            </label>
            <input
              type="tel"
              id="bidderPhone"
              name="bidderPhone"
              value={formData.bidderPhone}
              onChange={handleInputChange}
              required
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bidPrice">
                <FontAwesomeIcon icon={faRupeeSign} />
                Bid Price (₹) *
              </label>
              <input
                type="number"
                id="bidPrice"
                name="bidPrice"
                value={formData.bidPrice}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Enter your bid amount"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                <FontAwesomeIcon icon={faWeight} />
                Quantity
              </label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="e.g., 100 kg, 50 units"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Additional Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows="3"
              placeholder="Any special requirements or additional information..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidForm;
