import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faRefresh,
  faExternalLinkAlt,
  faBank,
  faPercent,
  faGlobe,
  faStar,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import '../Styles/LoansPage.css';

const LoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loanTypes, setLoanTypes] = useState([]);
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxInterestRate, setMaxInterestRate] = useState('');
  const [sortBy, setSortBy] = useState('interestRate');

  // Fetch loans data
  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/loans');
      const result = await response.json();
      
      if (result.success) {
        setLoans(result.data);
        setFilteredLoans(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch loans');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch loan types
  const fetchLoanTypes = async () => {
    try {
      const response = await fetch('/api/loans/types');
      const result = await response.json();
      
      if (result.success) {
        setLoanTypes(result.data);
      }
    } catch (err) {
      console.error('Error fetching loan types:', err);
    }
  };

  // Fetch loan statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/loans/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLoans();
    fetchLoanTypes();
    fetchStats();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...loans];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(loan =>
        loan.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter(loan => loan.type === selectedType);
    }

    // Interest rate filter
    if (maxInterestRate) {
      filtered = filtered.filter(loan => loan.interestRate <= parseFloat(maxInterestRate));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'interestRate':
          return a.interestRate - b.interestRate;
        case 'bankName':
          return a.bankName.localeCompare(b.bankName);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredLoans(filtered);
  }, [loans, searchTerm, selectedType, maxInterestRate, sortBy]);

  const handleRefresh = () => {
    fetchLoans();
    fetchStats();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setMaxInterestRate('');
    setSortBy('interestRate');
  };

  if (loading) {
    return (
      <div className="loans-page">
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin className="loading-spinner" />
          <p>Loading loans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loans-page">
        <div className="error-container">
          <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
          <h3>Error Loading Loans</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-btn">
            <FontAwesomeIcon icon={faRefresh} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loans-page">
      <div className="loans-container">
        {/* Header */}
        <div className="loans-header">
          <h1>
            <FontAwesomeIcon icon={faBank} />
            Agricultural Loans
          </h1>
          <p>Find the best loan options for your agricultural needs</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="stats-section">
            <div className="stat-card">
              <FontAwesomeIcon icon={faBank} />
              <div>
                <h3>{stats.totalLoans}</h3>
                <p>Total Loans</p>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faPercent} />
              <div>
                <h3>{stats.averageInterestRate.toFixed(1)}%</h3>
                <p>Avg Interest Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faStar} />
              <div>
                <h3>{stats.typesCount}</h3>
                <p>Loan Types</p>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faPercent} />
              <div>
                <h3>{stats.minInterestRate}%</h3>
                <p>Lowest Rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search by bank name or loan type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>
                <FontAwesomeIcon icon={faFilter} />
                Loan Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {loanTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>
                <FontAwesomeIcon icon={faPercent} />
                Max Interest Rate
              </label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={maxInterestRate}
                onChange={(e) => setMaxInterestRate(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>
                <FontAwesomeIcon icon={faFilter} />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="interestRate">Interest Rate</option>
                <option value="bankName">Bank Name</option>
                <option value="type">Loan Type</option>
              </select>
            </div>

            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-btn">
                Clear Filters
              </button>
              <button onClick={handleRefresh} className="refresh-btn">
                <FontAwesomeIcon icon={faRefresh} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="results-section">
          <div className="results-header">
            <h3>Available Loans ({filteredLoans.length})</h3>
          </div>

          {filteredLoans.length === 0 ? (
            <div className="no-results">
              <FontAwesomeIcon icon={faSearch} />
              <h3>No loans found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="loans-table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Bank Name</th>
                    <th>Type</th>
                    <th>Interest Rate</th>
                    <th>Features</th>
                    <th>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan, index) => (
                    <tr key={index}>
                      <td className="bank-name">
                        <FontAwesomeIcon icon={faBank} />
                        {loan.bankName}
                      </td>
                      <td className="loan-type">{loan.type}</td>
                      <td className="interest-rate">
                        <span className="rate-badge">{loan.interestRate}%</span>
                      </td>
                      <td className="features">
                        <div className="features-list">
                          {loan.features.map((feature, idx) => (
                            <span key={idx} className="feature-tag">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="website-link">
                        <a
                          href={loan.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="website-btn"
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} />
                          Visit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
