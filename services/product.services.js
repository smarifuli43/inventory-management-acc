const Product = require('../models/Product');
const Brand = require('../models/Brand');

exports.getProductsService = async (filters, queries) => {
  // ********* find all datas
  // const products = await Product.find({});

  // ********* using id
  // const products = await Product.find({ _id: '633705f130d3dcc37eff3f9d' }); // don't need to add ObjeccId() here

  // ********* findById
  // const products = await Product.findById('633705f130d3dcc37eff3f9d');

  // ********* using or operator
  // const products = await Product.find({
  //   $or: [{ _id: '633705f130d3dcc37eff3f9d' }, { name: 'challl' }],
  // });

  // ********* not out of stock
  // const products = await Product.find({ status: { $ne: 'out-of-stock' } });

  // ********* greater than 400
  //  const products = await Product.find({ price: { $gt: 300 } });

  // ********* $in operator
  // const products = await Product.find({ name: { $in: ['chal', 'daal'] } });

  // ********* projection
  // const products = await Product.find({}, '-name -quantity');
  // OR using select
  // const products = await Product.find().select({ name: 1 });

  // ********* limit
  // const products = await Product.find({}).limit(2);

  // ********* sort (descending)
  // const products = await Product.find({}).sort({ quantity: -1 });

  // ********* query builder for simplify the query
  // const products = await await Product.where('name')
  //   .equals(/\w/)
  //   .where('quantity')
  //   .gt(100)
  //   .lt(600)
  //   .limit(2)
  //   .sort({ quantity: -1 });

  const products = await Product.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const total = await Product.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);

  return { total, page, products };
};

exports.createProductService = async (data) => {
  const product = await Product.create(data);
  // step  1: _id , brand
  const { _id: productId, brand } = product;
  // step 2: update brand
  const res = await Brand.updateOne(
    { _id: brand.id },
    {
      $push: { products: productId },
    }
  );
  console.log(res);
  return product;
};

exports.updateProductByIdService = async (productId, data) => {
  // ********* updateOne method
  // const result = await Product.updateOne(
  //   { _id: productId },
  //   { $set: data },
  //   {
  //     runValidators: true, // updateOne does not run validators by default that's why we need to set it to true
  //   }
  // );

  // ********* find by id and save method
  // const product = await Product.findById(productId);
  // const result = await product.set(data).save();

  // ********* find by id and update method
  const result = await Product.findByIdAndUpdate(productId, data);

  return result;
};

exports.bulkUpdateProductsService = async (data) => {
  // ********* updateMany method. it updates all the products for same data
  // const result = await Product.updateMany({ _id: data.ids }, data.data, {
  //   runValidators: true,
  // });

  const products = [];
  data.ids.forEach((product) => {
    products.push(Product.updateOne({ _id: product.id }, product.data));
  });
  console.log(products);
  const result = await Promise.all(products);

  return result;
};

exports.deleteProductByIdService = async (id) => {
  const result = await Product.deleteOne({ _id: id });
  return result;
};

exports.bulkDeleteProductsService = async (data) => {
  const result = await Product.deleteMany({ _id: data.ids });
  return result;
};
