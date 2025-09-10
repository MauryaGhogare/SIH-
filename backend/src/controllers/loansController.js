import { loans } from '../data/loans.js';

// Get all loans with optional filtering
const getAllLoans = (req, res) => {
  try {
    let filteredLoans = [...loans];
    
    // Filter by type if provided
    if (req.query.type) {
      filteredLoans = filteredLoans.filter(loan => 
        loan.type.toLowerCase().includes(req.query.type.toLowerCase())
      );
    }
    
    // Filter by interest rate if provided
    if (req.query.interestRate) {
      const interestRate = parseFloat(req.query.interestRate);
      filteredLoans = filteredLoans.filter(loan => 
        loan.interestRate <= interestRate
      );
    }
    
    // Filter by state if provided
    if (req.query.state) {
      filteredLoans = filteredLoans.filter(loan => 
        loan.bankName.toLowerCase().includes(req.query.state.toLowerCase())
      );
    }
    
    // Filter by bank name if provided
    if (req.query.bankName) {
      filteredLoans = filteredLoans.filter(loan => 
        loan.bankName.toLowerCase().includes(req.query.bankName.toLowerCase())
      );
    }
    
    // Sort by interest rate (ascending) by default
    filteredLoans.sort((a, b) => a.interestRate - b.interestRate);
    
    res.json({
      success: true,
      count: filteredLoans.length,
      data: filteredLoans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loans',
      error: error.message
    });
  }
};

// Get loan by ID
const getLoanById = (req, res) => {
  try {
    const loanId = parseInt(req.params.id);
    const loan = loans.find(l => l.id === loanId);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    
    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan',
      error: error.message
    });
  }
};

// Get unique loan types
const getLoanTypes = (req, res) => {
  try {
    const types = [...new Set(loans.map(loan => loan.type))];
    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan types',
      error: error.message
    });
  }
};

// Get loan statistics
const getLoanStats = (req, res) => {
  try {
    const stats = {
      totalLoans: loans.length,
      averageInterestRate: loans.reduce((sum, loan) => sum + loan.interestRate, 0) / loans.length,
      minInterestRate: Math.min(...loans.map(loan => loan.interestRate)),
      maxInterestRate: Math.max(...loans.map(loan => loan.interestRate)),
      typesCount: [...new Set(loans.map(loan => loan.type))].length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching loan statistics',
      error: error.message
    });
  }
};

export {
  getAllLoans,
  getLoanById,
  getLoanTypes,
  getLoanStats
};
