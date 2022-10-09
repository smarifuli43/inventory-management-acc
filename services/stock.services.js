const Stock = require('../models/Stock');
const ObjectId = require('mongoose').Types.ObjectId;

exports.getStocksService = async (filters, queries) => {
  // const stocks = await Stock.find(filters)
  //   .skip(queries.skip)
  //   .limit(queries.limit)
  //   .select(queries.fields)
  //   .sort(queries.sortBy);

  // ************* Aggregate method
  const stocks = await Stock.aggregate([
    // { $match: { 'store.name': 'chittagong' } },
    { $match: {} },
    {
      $project: {
        store: 1,
        price: { $convert: { input: '$price', to: 'int' } },
        quantity: 1,
      },
    },
    {
      $group: {
        _id: '$store.name',
        totalProductsPrice: { $sum: { $multiply: ['$price', '$quantity'] } },
      },
    }, // for grouping all the store name
  ]);

  const total = await Stock.countDocuments(filters);
  const page = Math.ceil(total / queries.limit);

  return { total, page, stocks };
};

exports.getStockByIdService = async (id) => {
  //  ************* populate method
  // const stock = await Stock.findOne({ _id: id })
  //   .populate('store.id')
  //   .populate('suppliedBy.id')
  //   .populate('brand.id');'

  // ************* Aggregate method
  const stock = await Stock.aggregate([
    // stage 1
    { $match: { _id: ObjectId(id) } },
    {
      $project: {
        name: 1,
        category: 1,
        quantity: 1,
        price: 1,
        productId: 1,
        'brand.name': { $toLower: '$brand.name' },
      },
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brand.name',
        foreignField: 'name',
        as: 'brandDetails',
      },
    },
  ]);
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
