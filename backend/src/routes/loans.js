import express from 'express';
import {
  getAllLoans,
  getLoanById,
  getLoanTypes,
  getLoanStats
} from '../controllers/loansController.js';

const router = express.Router();

// GET /api/loans - Get all loans with optional filtering
router.get('/', getAllLoans);

// GET /api/loans/types - Get all unique loan types
router.get('/types', getLoanTypes);

// GET /api/loans/stats - Get loan statistics
router.get('/stats', getLoanStats);

// GET /api/loans/:id - Get loan by ID
router.get('/:id', getLoanById);

export default router;
