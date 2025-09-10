import React, { useState, useEffect } from 'react'
import { Navbar } from '../componets/navbar'
import { Footer } from '../componets/footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSearch, 
  faFilter, 
  faSort, 
  faStar, 
  faMapMarkerAlt, 
  faShoppingCart,
  faHeart,
  faEye,
  faTruck,
  faLeaf,
  faSeedling,
  faAppleAlt,
  faCarrot,
  faWheatAwn,
  faPepperHot,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons'
import '../Styles/MarketplacePage.css'
import { useCartStore } from '../stores/useCartStore'
import { faThLarge, faList } from '@fortawesome/free-solid-svg-icons'
import BidForm from '../components/BidForm'
import biddingService from '../services/biddingService'

// Mock data for farmers
const mockFarmers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    mainCrop: "Organic Tomatoes",
    farmName: "Green Valley Organic Farm",
    location: "Punjab, India",
    farmSize: "25 acres",
    experience: "15 years",
    rating: 4.8,
    reviews: 124,
    image: "/farmer.jpg",
    category: "organic",
    description: "Experienced organic farmer specializing in sustainable agriculture practices",
    verified: true
  },
  {
    id: 2,
    name: "Priya Sharma",
    mainCrop: "Premium Basmati Rice",
    farmName: "Sharma Family Farm",
    location: "Haryana, India",
    farmSize: "18 acres",
    experience: "12 years",
    rating: 4.9,
    reviews: 89,
    image: "/farwer2.jpg",
    category: "grains",
    description: "Premium quality grain producer with traditional farming methods",
    verified: true
  },
  {
    id: 3,
    name: "Amit Singh",
    mainCrop: "Fresh Spinach",
    farmName: "Singh Vegetable Farm",
    location: "Uttar Pradesh, India",
    farmSize: "12 acres",
    experience: "8 years",
    rating: 4.6,
    reviews: 67,
    image: "/farmer1.png",
    category: "vegetables",
    description: "Fresh vegetable producer focusing on leafy greens and seasonal crops",
    verified: true
  },
  {
    id: 4,
    name: "Sunita Devi",
    mainCrop: "Sweet Mangoes",
    farmName: "Devi Mango Orchard",
    location: "Bihar, India",
    farmSize: "30 acres",
    experience: "20 years",
    rating: 4.7,
    reviews: 156,
    image: "/farwer.jpg",
    category: "fruits",
    description: "Fruit orchard specialist with expertise in tropical fruits",
    verified: true
  },
  {
    id: 5,
    name: "Vikram Patel",
    mainCrop: "Golden Corn",
    farmName: "Patel Corn Fields",
    location: "Gujarat, India",
    farmSize: "35 acres",
    experience: "10 years",
    rating: 4.5,
    reviews: 43,
    image: "/farmer2.jpg",
    category: "grains",
    description: "Large-scale grain producer specializing in corn and oilseeds",
    verified: true
  },
  {
    id: 6,
    name: "Ramesh Yadav",
    mainCrop: "Organic Wheat",
    farmName: "Yadav Wheat Farm",
    location: "Madhya Pradesh, India",
    farmSize: "22 acres",
    experience: "18 years",
    rating: 4.8,
    reviews: 98,
    image: "/farmer3.jpg",
    category: "grains",
    description: "Traditional wheat farmer with organic certification",
    verified: true
  },
  {
    id: 7,
    name: "Kiran Patil",
    mainCrop: "Fresh Bananas",
    farmName: "Patil Banana Plantation",
    location: "Maharashtra, India",
    farmSize: "20 acres",
    experience: "14 years",
    rating: 4.6,
    reviews: 142,
    image: "/farwer3.jpg",
    category: "fruits",
    description: "Tropical fruit specialist with modern irrigation systems",
    verified: true
  },
  {
    id: 8,
    name: "Imran Khan",
    mainCrop: "Premium Apples",
    farmName: "Khan Apple Orchard",
    location: "Jammu & Kashmir, India",
    farmSize: "15 acres",
    experience: "16 years",
    rating: 4.7,
    reviews: 201,
    image: "/farmer4.jpg",
    category: "fruits",
    description: "High-altitude fruit grower specializing in temperate fruits",
    verified: true
  }
]

// Limit catalogue to the original set with verified images (first 8 items)
const baseFarmers = mockFarmers.filter((f) => f.id <= 8)

const categories = [
  { id: 'all', name: 'All Farmers', icon: faLeaf },
  { id: 'vegetables', name: 'Vegetable Farmers', icon: faCarrot },
  { id: 'fruits', name: 'Fruit Farmers', icon: faAppleAlt },
  { id: 'grains', name: 'Grain Farmers', icon: faWheatAwn },
  { id: 'organic', name: 'Organic Farmers', icon: faSeedling }
]

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'popular', label: 'Most Popular' }
]

export const MarketplacePage = () => {
  const [farmers, setFarmers] = useState(baseFarmers)
  const [filteredFarmers, setFilteredFarmers] = useState(baseFarmers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState(new Set())
  const { addItem } = useCartStore()
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [showQuickView, setShowQuickView] = useState(false)
  const [selectedFarmer, setSelectedFarmer] = useState(null)
  const [showBidForm, setShowBidForm] = useState(false)
  const [selectedFarmerForBid, setSelectedFarmerForBid] = useState(null)

  const openQuickView = (farmer) => {
    setSelectedFarmer(farmer)
    setShowQuickView(true)
  }

  const closeQuickView = () => {
    setShowQuickView(false)
    setSelectedFarmer(null)
  }

  const openBidForm = (farmer) => {
    setSelectedFarmerForBid(farmer)
    setShowBidForm(true)
  }

  const closeBidForm = () => {
    setShowBidForm(false)
    setSelectedFarmerForBid(null)
  }

  const handleBidPlaced = (newBid) => {
    // Update bid store if needed
    console.log('New bid placed:', newBid)
    // You can add additional logic here like updating UI state
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('popular')
  }

  // Filter and search functionality
  useEffect(() => {
    // Always work on a copy to avoid mutating state during sort
    let filtered = [...farmers]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(farmer =>
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(farmer => farmer.category === selectedCategory)
    }

    // Sort farmers
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'experience':
        filtered.sort((a, b) => parseInt(b.experience) - parseInt(a.experience))
        break
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        break
    }

    setFilteredFarmers(filtered)
  }, [searchTerm, selectedCategory, sortBy, farmers])

  const toggleWishlist = (farmerId) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(farmerId)) {
      newWishlist.delete(farmerId)
    } else {
      newWishlist.add(farmerId)
    }
    setWishlist(newWishlist)
  }

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : faLeaf
  }

  return (
    <div className="marketplace-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="marketplace-hero">
        {/* Background media (image) */}
        <div className="hero-media">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop"
            alt="Farmer carrying fresh seasonal produce in a field"
          />
        </div>

        <div className="hero-content">
          <h1>Farmer - Consumer Marketplace</h1>
          <p>Connect with verified farmers and place bids on their produce. Farmers choose the best offers for their crops.</p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search for farmers or crops..."
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

      {/* Filters Section */}
      {showFilters && (
        <section className="filters-section">
          <div className="filters-container">
            <div className="filters-header-row">
              <h3>Filters</h3>
              <button className="clear-filters-btn" onClick={handleClearFilters}>Clear all</button>
            </div>
            <div className="filter-group">
              <h3>Categories</h3>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <FontAwesomeIcon icon={category.icon} />
                    {category.name}
                  </button>
                ))}
              </div>
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
        </section>
      )}

      {/* Quick Filters */}
      <section className="quick-filters">
        <div className="quick-filters-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`quick-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <FontAwesomeIcon icon={category.icon} />
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <div className="products-header">
          <h2>Verified Farmers ({filteredFarmers.length} farmers)</h2>
          <div className="header-actions">
            <div className="view-toggle">
              <button
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <FontAwesomeIcon icon={faThLarge} />
              </button>
              <button
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <FontAwesomeIcon icon={faList} />
              </button>
            </div>
            <div className="sort-dropdown">
            <FontAwesomeIcon icon={faSort} />
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

        <div className={`products-grid ${viewMode === 'list' ? 'list' : ''}`}>
          {filteredFarmers.map(farmer => (
            <div key={farmer.id} className="product-card">
              <div className="product-image">
                <img src={farmer.image} alt={farmer.name} />
                <div className="product-badges">
                  {farmer.verified && <span className="verified-badge">Verified</span>}
                </div>
                <button 
                  className={`wishlist-btn ${wishlist.has(farmer.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(farmer.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>

              <div className="product-info">
                <div className="product-header">
                  <h3>{farmer.name}</h3>
                  <div className="product-rating">
                    <FontAwesomeIcon icon={faStar} />
                    <span>{farmer.rating}</span>
                    <span className="reviews">({farmer.reviews})</span>
                  </div>
                </div>

                <div className="farmer-info">
                  <FontAwesomeIcon icon={faSeedling} />
                  <span>{farmer.farmName}</span>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>{farmer.location}</span>
                </div>

                <p className="product-description">{farmer.description}</p>

                <div className="product-details">
                  <div className="farm-info">
                    <span>Farm Size: {farmer.farmSize}</span>
                    <span>Experience: {farmer.experience}</span>
                  </div>
                </div>

                <div className="product-footer">
                  <button className="crop-button" onClick={() => openQuickView(farmer)}>
                    {farmer.mainCrop}
                  </button>
                  <button className="crop-details-btn" onClick={() => openQuickView(farmer)}>
                    <FontAwesomeIcon icon={faWheatAwn} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFarmers.length === 0 && (
          <div className="no-products">
            <FontAwesomeIcon icon={faLeaf} />
            <h3>No farmers found</h3>
            <p>Try adjusting your search or filters to find farmers you're looking for.</p>
          </div>
        )}
      </section>

      {showQuickView && selectedFarmer && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qv-media">
              <img src={selectedFarmer.image} alt={selectedFarmer.name} loading="eager" />
            </div>
            <div className="qv-info">
              <h3>{selectedFarmer.name}</h3>
              <div className="qv-crop-info">
                <h4>Main Crop: <span className="crop-name">{selectedFarmer.mainCrop}</span></h4>
                <div className="qv-farmer-details">
                  <div className="qv-detail-item">
                    <FontAwesomeIcon icon={faSeedling} />
                    <span><strong>Farm:</strong> {selectedFarmer.farmName}</span>
                  </div>
                  <div className="qv-detail-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span><strong>Location:</strong> {selectedFarmer.location}</span>
                  </div>
                  <div className="qv-detail-item">
                    <FontAwesomeIcon icon={faStar} />
                    <span><strong>Rating:</strong> {selectedFarmer.rating} ({selectedFarmer.reviews} reviews)</span>
                  </div>
                  <div className="qv-detail-item">
                    <FontAwesomeIcon icon={faWheatAwn} />
                    <span><strong>Farm Size:</strong> {selectedFarmer.farmSize}</span>
                  </div>
                  <div className="qv-detail-item">
                    <FontAwesomeIcon icon={faLeaf} />
                    <span><strong>Experience:</strong> {selectedFarmer.experience}</span>
                  </div>
                </div>
                <p className="qv-desc">{selectedFarmer.description}</p>
              </div>
              <div className="qv-actions">
                <button className="add-to-cart-btn" onClick={() => openBidForm(selectedFarmer)}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Place Bid
                </button>
                <button className="qv-close" onClick={closeQuickView}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BidForm 
        farmer={selectedFarmerForBid}
        isOpen={showBidForm}
        onClose={closeBidForm}
        onBidPlaced={handleBidPlaced}
      />

      <Footer />
    </div>
  )
}
