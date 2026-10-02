import express from 'express';
import {
  createSizeChart,
  getAllSizeCharts,
  getSizeChartById,
  getSizeChartByProduct,
  updateSizeChart,
  deleteSizeChart,
  getProductSizes,
} from '../Controller/sizeChartController.js';

const router = express.Router();

// ⚠️ ORDER MATTERS — specific routes first
router.get('/products/:productId/sizes', getProductSizes);
router.get('/product/:productId', getSizeChartByProduct);

router.get('/', getAllSizeCharts);
router.get('/:id', getSizeChartById);
router.post('/', createSizeChart);
router.put('/:id', updateSizeChart);
router.delete('/:id', deleteSizeChart);

export default router;
