const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const uploader = require('../middleware/uploader');

router.post(
  '/file-upload',
  // uploader.single('image'), // for single file
  uploader.array('image', 5), // for multiple files
  productController.fileUpload
);

// at client side, we need to send the file as a form data
{
  /* <input type="file" name="iamge"> */
}
// const formData = new FormData();
// formData.append('image', formData);

router.route('/bulk-update').patch(productController.bulkUpdateProducts);
router.route('/bulk-delete').delete(productController.bulkDeleteProducts);
router
  .route('/')
  .get(productController.getProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .patch(productController.updateProductById)
  .delete(productController.deleteProductById);

module.exports = router;
