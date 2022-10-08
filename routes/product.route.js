const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authorization = require('../middleware/authorization');
const uploader = require('../middleware/uploader');
const verifyToken = require('../middleware/verifyToken');

// router.use(verifyToken); // if we need to protect all routes in this file, we can use this middleware here

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
router.route('/').get(productController.getProducts).post(
  verifyToken,
  authorization('admin', 'store-manager'), // this function will return a middleware function that will check if the user is authorized
  productController.createProduct
);

router
  .route('/:id')
  .patch(productController.updateProductById)
  .delete(authorization('admin'), productController.deleteProductById);

module.exports = router;
