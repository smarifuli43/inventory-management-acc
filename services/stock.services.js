const Stock = require('../models/Stock');

exports.getStocksService = async (filters, queries) => {
  const stocks = await Stock.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);

  const total = await Stock.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);

  return { total, page, stocks };
};

exports.getStockByIdService = async (id) => {
  const stock = await Stock.findOne({ _id: id })
    .populate('store.id')
    .populate('suppliedBy.id')
    .populate('brand.id');
  return stock;
};

exports.createStockService = async (data) => {
  const stock = await Stock.create(data);

  return stock;
};

exports.updateStockByIdService = async (stockId, data) => {
  // ********* find by id and update method
  const result = await Stock.findByIdAndUpdate(stockId, data);

  return result;
};

// exports.bulkUpdateProductsService = async (data) => {
//   // ********* updateMany method. it updates all the products for same data
//   // const result = await Product.updateMany({ _id: data.ids }, data.data, {
//   //   runValidators: true,
//   // });

//   const products = [];
//   data.ids.forEach((product) => {
//     products.push(Product.updateOne({ _id: product.id }, product.data));
//   });
//   console.log(products);
//   const result = await Promise.all(products);

//   return result;
// };

// exports.deleteProductByIdService = async (id) => {
//   const result = await Product.deleteOne({ _id: id });
//   return result;
// };

// exports.bulkDeleteProductsService = async (data) => {
//   const result = await Product.deleteMany({ _id: data.ids });
//   return result;
// };
