// Local Bidding Service - Simulates bid operations without database
class BiddingService {
  constructor() {
    this.storageKey = 'farmer_bids';
    this.bidIdCounter = this.getNextBidId();
  }

  // Get next available bid ID
  getNextBidId() {
    const bids = this.getAllBids();
    if (bids.length === 0) return 1;
    return Math.max(...bids.map(bid => bid.id)) + 1;
  }

  // Get all bids from localStorage
  getAllBids() {
    try {
      const bids = localStorage.getItem(this.storageKey);
      return bids ? JSON.parse(bids) : [];
    } catch (error) {
      console.error('Error loading bids:', error);
      return [];
    }
  }

  // Save bids to localStorage
  saveBids(bids) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(bids));
    } catch (error) {
      console.error('Error saving bids:', error);
    }
  }

  // Place a new bid
  placeBid(bidData) {
    const bids = this.getAllBids();
    const newBid = {
      id: this.bidIdCounter++,
      farmerId: bidData.farmerId,
      farmerName: bidData.farmerName,
      cropName: bidData.cropName,
      bidderName: bidData.bidderName || 'Anonymous Bidder',
      bidderEmail: bidData.bidderEmail || '',
      bidderPhone: bidData.bidderPhone || '',
      bidPrice: bidData.bidPrice,
      quantity: bidData.quantity || '1 unit',
      message: bidData.message || '',
      status: 'pending',
      bidDate: new Date().toISOString(),
      farmerImage: bidData.farmerImage,
      farmName: bidData.farmName,
      location: bidData.location
    };

    bids.push(newBid);
    this.saveBids(bids);
    
    // Show success notification
    this.showNotification('Bid placed successfully!', 'success');
    
    return newBid;
  }

  // Get bids for a specific farmer
  getBidsForFarmer(farmerId) {
    const bids = this.getAllBids();
    return bids.filter(bid => bid.farmerId === farmerId);
  }

  // Get all bids (for dashboard)
  getAllBidsForDashboard() {
    return this.getAllBids();
  }

  // Update bid status (for farmer actions)
  updateBidStatus(bidId, status) {
    const bids = this.getAllBids();
    const bidIndex = bids.findIndex(bid => bid.id === bidId);
    
    if (bidIndex !== -1) {
      bids[bidIndex].status = status;
      bids[bidIndex].updatedDate = new Date().toISOString();
      this.saveBids(bids);
      return bids[bidIndex];
    }
    
    return null;
  }

  // Delete a bid
  deleteBid(bidId) {
    const bids = this.getAllBids();
    const filteredBids = bids.filter(bid => bid.id !== bidId);
    this.saveBids(filteredBids);
  }

  // Clear all bids (for testing)
  clearAllBids() {
    localStorage.removeItem(this.storageKey);
    this.bidIdCounter = 1;
  }

  // Show notification
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `bid-notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    // Set background color based on type
    if (type === 'success') {
      notification.style.backgroundColor = '#2e7d32';
    } else if (type === 'error') {
      notification.style.backgroundColor = '#d32f2f';
    } else {
      notification.style.backgroundColor = '#1976d2';
    }

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Generate sample bids for testing
  generateSampleBids() {
    const sampleBids = [
      {
        id: 1,
        farmerId: 1,
        farmerName: "Rajesh Kumar",
        cropName: "Organic Tomatoes",
        bidderName: "FreshMart Supermarket",
        bidderEmail: "orders@freshmart.com",
        bidderPhone: "+91 98765 43210",
        bidPrice: 45000,
        quantity: "500 kg",
        message: "Looking for organic tomatoes for our premium section",
        status: "pending",
        bidDate: "2024-01-15T10:30:00Z",
        farmerImage: "/farmer.jpg",
        farmName: "Green Valley Organic Farm",
        location: "Punjab, India"
      },
      {
        id: 2,
        farmerId: 2,
        farmerName: "Priya Sharma",
        cropName: "Premium Basmati Rice",
        bidderName: "Green Valley Foods",
        bidderEmail: "procurement@greenvalley.com",
        bidderPhone: "+91 87654 32109",
        bidPrice: 36000,
        quantity: "300 kg",
        message: "Need premium quality rice for export",
        status: "accepted",
        bidDate: "2024-01-14T14:20:00Z",
        farmerImage: "/farwer2.jpg",
        farmName: "Sharma Family Farm",
        location: "Haryana, India"
      }
    ];

    this.saveBids(sampleBids);
    this.bidIdCounter = 3;
    return sampleBids;
  }
}

// Export singleton instance
export const biddingService = new BiddingService();
export default biddingService;
