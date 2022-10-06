const { default: mongoose } = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

// schema design
const stockSchema = mongoose.Schema(
  {
    productId: {
      type: ObjectId,
      required: true,
      ref: 'Product',
    },

    name: {
      type: String,
      required: [true, 'Please provide a name for this product'],
      trim: true,
      minLength: [3, 'Product name must be at least 3 characters long'],
      maxLength: [100, 'Name is too large'],
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, 'Please provide a description for this product'],
    },

    unit: {
      type: String,
      required: true,
      enum: {
        values: ['kg', 'litre', 'pcs', 'bag'],
        message: "unit value can't be {VALUE}, must be kg/litre/pcs/bag",
      },
    },

    imageURLs: [
      {
        type: String,
        required: true,
        validate: [validator.isURL, 'wrong url'],
      },
    ],

    price: {
      type: Number,
      required: [true, 'Please provide a price for this product'],
      min: [0, 'price cannot be negative'],
    },

    quantity: {
      type: Number,
      required: [true, 'Please provide a price for this product'],
      min: [0, 'quantity cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Please provide a category for this product'],
    },

    brand: {
      name: {
        type: String,
        required: [true, 'Please provide a brand for this product'],
      },
      id: {
        type: ObjectId,
        ref: 'Brand',
        required: true,
      },
    },

    status: {
      type: String,
      required: true,
      enum: {
        values: ['in-stock', 'out-of-stock', 'discontinued'],
        message:
          "status value can't be {VALUE}, must be active/inactive/discontinued",
      },
    },

    store: {
      name: {
        type: String,
        trim: true,
        required: [true, 'Please add a store name'],
        maxlength: [100, 'Brand name cannot be more than 100 characters'],
        lowercase: true,
        enum: {
          values: [
            'dhaka',
            'chittagong',
            'khulna',
            'rajshahi',
            'barisal',
            'sylhet',
            'rangpur',
          ],
          message: `{VALUE} is not supported`,
        },
      },
      id: {
        type: ObjectId,
        required: true,
        ref: 'Store',
      },
    },

    suppliedBy: {
      name: {
        type: String,
        trim: true,
        required: [true, 'Please add a store name'],
        maxlength: [100, 'Brand name cannot be more than 100 characters'],
      },
      id: {
        type: ObjectId,
        ref: 'Supplier',
      },
    },
    sellCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// schema --> model --> query
// model
const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
