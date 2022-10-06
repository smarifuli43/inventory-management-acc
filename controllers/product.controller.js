const {
  getProductsService,
  createProductService,
  updateProductByIdService,
  bulkUpdateProductsService,
  deleteProductByIdService,
  bulkDeleteProductsService,
} = require('../services/product.services');

// get the prodcuts
exports.getProducts = async (req, res, next) => {
  try {
    // ********* only valid for equal to queries. EX: status=out-of-stock
    let filters = { ...req.query };
    const excludeFields = ['sort', 'page', 'limit'];
    excludeFields.forEach((field) => delete filters[field]);

    // ********* advanced filtering for greater than, less than, etc EX: price[gte]=100
    let filtersString = JSON.stringify(filters);
    filtersString = filtersString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    filters = JSON.parse(filtersString);

    const queries = {};
    // ********* sorting EX: sort=price,description
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queries.sortBy = sortBy;
    }

    // ********* projection EX: fields=name,description
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      queries.fields = fields;
    }

    // ********* pagination EX: page=2&limit=10
    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }

    const products = await getProductsService(filters, queries);

    res.status(200).json({
      status: 'success',
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Data is not valid',
      error: error.message,
    });
  }
};

// create a new product

exports.createProduct = async (req, res, next) => {
  try {
    // save or create
    // const result = await product.save();

    // another way of inserting
    const result = await createProductService(req.body);

    // const product = new Product(req.body);
    // /// // instance creation --> do something --> save()
    // if (product.quantity == 0) {
    //   product.status = 'out-of-stock';
    // }
    // const result = await product.save();
    //****** */ this is not a good way to do this :: use above mongoose middleware

    result.logger();

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Data is not valid',
      error: error.message,
    });
  }
};

// update a product
exports.updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await updateProductByIdService(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Data is not valid',
      error: error.message,
    });
  }
};

// bulk update products
exports.bulkUpdateProducts = async (req, res, next) => {
  try {
    const result = await bulkUpdateProductsService(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Products updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Data is not valid',
      error: error.message,
    });
  }
};

// delete a product
exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = deleteProductByIdService(id);

    if (!result.deletedCount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Could not delete the product',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not delete the product',
      error: error.message,
    });
  }
};

// bulk delete products

exports.bulkDeleteProducts = async (req, res, next) => {
  try {
    const result = await bulkDeleteProductsService(req.body);
    console.log(result);

    res.status(200).json({
      status: 'success',
      message: 'Products deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not delete the products',
      error: error.message,
    });
  }
};

//  file upload
exports.fileUpload = async (req, res, next) => {
  try {
    res.status(200).json(req.files);
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'Could not upload the file',
      error: error.message,
    });
  }
};
