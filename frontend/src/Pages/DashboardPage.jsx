import React, { useState, useEffect } from 'react'
import { Navbar } from '../componets/navbar'
import { Footer } from '../componets/footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSortAmountDown, 
  faSortAmountUp,
  faCheckCircle,
  faTimesCircle,
  faEye,
  faCalendarAlt,
  faMapMarkerAlt,
  faTruck,
  faUser,
  faChartLine,
  faFilter,
  faSearch,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import '../Styles/DashboardPage.css'
import biddingService from '../services/biddingService'

// Mock data for farmer's bids
const mockBids = [
  {
    id: 1,
    bidderName: "FreshMart Supermarket",
    bidderType: "Retailer",
    cropName: "Maize (Corn)",
    quantity: "500 kg",
    bidPrice: 45000,
    bidPricePerKg: 90,
    bidDate: "2024-01-15",
    deliveryLocation: "Mumbai, Maharashtra",
    deliveryDate: "2024-01-20",
    status: "pending", // pending, accepted, rejected
    bidderRating: 4.8,
    bidderReviews: 156,
    specialRequirements: "Organic certification required",
    contactInfo: "+91 98765 43210",
    bidderImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face",
    category: "vegetables"
  },
  {
    id: 2,
    bidderName: "Green Valley Foods",
    bidderType: "Food Processor",
    cropName: "Beans",
    quantity: "300 kg",
    bidPrice: 36000,
    bidPricePerKg: 120,
    bidDate: "2024-01-14",
    deliveryLocation: "Delhi, NCR",
    deliveryDate: "2024-01-25",
    status: "pending",
    bidderRating: 4.9,
    bidderReviews: 89,
    specialRequirements: "Fresh harvest preferred",
    contactInfo: "+91 87654 32109",
    bidderImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    category: "vegetables"
  },
  {
    id: 3,
    bidderName: "Local Vegetable Market",
    bidderType: "Local Market",
    cropName: "Pumpkin",
    quantity: "200 kg",
    bidPrice: 25000,
    bidPricePerKg: 125,
    bidDate: "2024-01-13",
    deliveryLocation: "Lucknow, Uttar Pradesh",
    deliveryDate: "2024-01-18",
    status: "accepted",
    bidderRating: 4.6,
    bidderReviews: 67,
    specialRequirements: "Daily delivery preferred",
    contactInfo: "+91 76543 21098",
    bidderImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    category: "vegetables"
  }
]

const statusOptions = [
  { value: 'all', label: 'All Bids' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' }
]

const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'grains', label: 'Grains' }
]

const sortOptions = [
  { value: 'price-high', label: 'Highest Bid Price' },
  { value: 'price-low', label: 'Lowest Bid Price' },
  { value: 'date-new', label: 'Newest First' },
  { value: 'date-old', label: 'Oldest First' },
  { value: 'rating', label: 'Highest Bidder Rating' }
]

export const DashboardPage = () => {
  const [bids, setBids] = useState([])
  const [filteredBids, setFilteredBids] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('price-high')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBid, setSelectedBid] = useState(null)
  const [showBidDetails, setShowBidDetails] = useState(false)

  // Load bids from bidding service
  useEffect(() => {
    const loadBids = () => {
      let allBids = biddingService.getAllBidsForDashboard()
      
      // If no bids exist, generate sample bids for demo
      if (allBids.length === 0) {
        allBids = biddingService.generateSampleBids()
      }
      
      setBids(allBids)
      setFilteredBids(allBids)
    }

    loadBids()
    
    // Listen for storage changes to update bids in real-time
    const handleStorageChange = () => {
      loadBids()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...bids]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bid =>
        bid.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.bidderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.bidderType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bid => bid.status === statusFilter)
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(bid => bid.category === categoryFilter)
    }

    // Sort bids
    switch (sortBy) {
      case 'price-high':
        filtered.sort((a, b) => b.bidPrice - a.bidPrice)
        break
      case 'price-low':
        filtered.sort((a, b) => a.bidPrice - b.bidPrice)
        break
      case 'date-new':
        filtered.sort((a, b) => new Date(b.bidDate) - new Date(a.bidDate))
        break
      case 'date-old':
        filtered.sort((a, b) => new Date(a.bidDate) - new Date(b.bidDate))
        break
      case 'rating':
        filtered.sort((a, b) => b.bidderRating - a.bidderRating)
        break
      default:
        break
    }

    setFilteredBids(filtered)
  }, [searchTerm, statusFilter, categoryFilter, sortBy, bids])

  const handleBidAction = (bidId, action) => {
    const updatedBid = biddingService.updateBidStatus(bidId, action)
    if (updatedBid) {
      // Update local state
      setBids(prevBids => 
        prevBids.map(bid => 
          bid.id === bidId ? { ...bid, status: action } : bid
        )
      )
      
      // Show notification
      const actionText = action === 'accepted' ? 'accepted' : action === 'rejected' ? 'rejected' : 'updated'
      biddingService.showNotification(`Bid ${actionText} successfully!`, 'success')
    }
  }

  const openBidDetails = (bid) => {
    setSelectedBid(bid)
    setShowBidDetails(true)
  }

  const closeBidDetails = () => {
    setShowBidDetails(false)
    setSelectedBid(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return '#4caf50'
      case 'rejected': return '#f44336'
      case 'pending': return '#ff9800'
      default: return '#666'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return faCheckCircle
      case 'rejected': return faTimesCircle
      case 'pending': return faCalendarAlt
      default: return faCalendarAlt
    }
  }

  const totalBids = bids.length
  const pendingBids = bids.filter(bid => bid.status === 'pending').length
  const acceptedBids = bids.filter(bid => bid.status === 'accepted').length
  const totalValue = bids.reduce((sum, bid) => sum + bid.bidPrice, 0)

  return (
    <div className="dashboard-page">
      <Navbar />
      
      {/* Dashboard Header */}
      <section className="dashboard-header">
        <div className="dashboard-container">
          <div className="header-content">
            <h1>Farmer Dashboard</h1>
            <p>Manage bids and track your crop sales</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="search-filter-container">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search crops or bidders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <FontAwesomeIcon icon={faFilter} />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="stats-section">
        <div className="dashboard-container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className="stat-content">
                <h3>{totalBids}</h3>
                <p>Total Bids</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="stat-content">
                <h3>{pendingBids}</h3>
                <p>Pending Bids</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="stat-content">
                <h3>{acceptedBids}</h3>
                <p>Accepted Bids</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className="stat-content">
                <h3>₹{totalValue.toLocaleString()}</h3>
                <p>Total Value</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      {showFilters && (
        <section className="filters-section">
          <div className="dashboard-container">
            <div className="filters-container">
            <div className="filter-group">
              <h3>Status</h3>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <h3>Category</h3>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <h3>Sort By</h3>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            </div>
          </div>
        </section>
      )}

      {/* Bids Section */}
      <section className="bids-section">
        <div className="dashboard-container">
          <div className="bids-header">
            <h2>Bid Management ({filteredBids.length} bids)</h2>
            <div className="sort-dropdown">
              <FontAwesomeIcon icon={faSortAmountDown} />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bids-grid">
            {filteredBids.map(bid => (
              <div key={bid.id} className="bid-card">
                <div className="bid-header">
                  <div className="bidder-info">
                    <img src={bid.bidderImage} alt={bid.bidderName} className="bidder-avatar" />
                    <div className="bidder-details">
                      <h3>{bid.bidderName}</h3>
                      <p>{bid.bidderType}</p>
                      <div className="bidder-rating">
                        <FontAwesomeIcon icon={faChartLine} />
                        <span>{bid.bidderRating}</span>
                        <span>({bid.bidderReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="bid-status">
                    <FontAwesomeIcon 
                      icon={getStatusIcon(bid.status)} 
                      style={{ color: getStatusColor(bid.status) }}
                    />
                    <span style={{ color: getStatusColor(bid.status) }}>
                      {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="bid-content">
                  <div className="crop-info">
                    <h4>{bid.cropName}</h4>
                    <p>Quantity: {bid.quantity}</p>
                  </div>
                  
                  <div className="bid-price">
                    <span className="price">₹{bid.bidPrice.toLocaleString()}</span>
                    <span className="price-per-unit">₹{bid.bidPricePerKg}/kg</span>
                  </div>

                  <div className="bid-details">
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>Bid Date: {new Date(bid.bidDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faTruck} />
                      <span>Delivery: {new Date(bid.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{bid.deliveryLocation}</span>
                    </div>
                  </div>

                  {bid.specialRequirements && (
                    <div className="special-requirements">
                      <strong>Requirements:</strong> {bid.specialRequirements}
                    </div>
                  )}
                </div>

                <div className="bid-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => openBidDetails(bid)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View Details
                  </button>
                  
                  {bid.status === 'pending' && (
                    <div className="action-buttons">
                      <button 
                        className="accept-btn"
                        onClick={() => handleBidAction(bid.id, 'accepted')}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                        Accept
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => handleBidAction(bid.id, 'rejected')}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredBids.length === 0 && (
            <div className="no-bids">
              <FontAwesomeIcon icon={faChartLine} />
              <h3>No bids found</h3>
              <p>Try adjusting your search or filters to find bids.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bid Details Modal */}
      {showBidDetails && selectedBid && (
        <div className="bid-details-overlay" onClick={closeBidDetails}>
          <div className="bid-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bid Details</h3>
              <button className="close-btn" onClick={closeBidDetails}>
                <FontAwesomeIcon icon={faTimesCircle} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="bidder-section">
                <img src={selectedBid.bidderImage} alt={selectedBid.bidderName} />
                <div>
                  <h4>{selectedBid.bidderName}</h4>
                  <p>{selectedBid.bidderType}</p>
                  <p>Rating: {selectedBid.bidderRating} ({selectedBid.bidderReviews} reviews)</p>
                  <p>Contact: {selectedBid.contactInfo}</p>
                </div>
              </div>
              
              <div className="crop-section">
                <h4>Crop Details</h4>
                <p><strong>Crop:</strong> {selectedBid.cropName}</p>
                <p><strong>Quantity:</strong> {selectedBid.quantity}</p>
                <p><strong>Bid Price:</strong> ₹{selectedBid.bidPrice.toLocaleString()}</p>
                <p><strong>Price per kg:</strong> ₹{selectedBid.bidPricePerKg}</p>
              </div>
              
              <div className="logistics-section">
                <h4>Logistics</h4>
                <p><strong>Bid Date:</strong> {new Date(selectedBid.bidDate).toLocaleDateString()}</p>
                <p><strong>Delivery Date:</strong> {new Date(selectedBid.deliveryDate).toLocaleDateString()}</p>
                <p><strong>Delivery Location:</strong> {selectedBid.deliveryLocation}</p>
                {selectedBid.specialRequirements && (
                  <p><strong>Special Requirements:</strong> {selectedBid.specialRequirements}</p>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              {selectedBid.status === 'pending' && (
                <>
                  <button 
                    className="accept-btn"
                    onClick={() => {
                      handleBidAction(selectedBid.id, 'accepted')
                      closeBidDetails()
                    }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Accept Bid
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => {
                      handleBidAction(selectedBid.id, 'rejected')
                      closeBidDetails()
                    }}
                  >
                    <FontAwesomeIcon icon={faTimesCircle} />
                    Reject Bid
                  </button>
                </>
              )}
              <button className="close-modal-btn" onClick={closeBidDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
