const { default: mongoose } = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');

// schema design
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name for this product'],
      trim: true,
      unique: [true, 'Name must be unique'],
      minLength: [3, 'Product name must be at least 3 characters long'],
      maxLength: [100, 'Name is too large'],
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this product'],
    },

    // ******** price is now in stock model ********
    // price: {
    //   type: Number,
    //   required: true,
    //   min: [0, 'price cannot be negative'],
    // },

    unit: {
      type: String,
      required: true,
      // enum:["kg", "g", "litre", "ml", "piece"],
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

    // ********  quantity is now in stock model ********
    // quantity: {
    //   type: Number,
    //   required: true,
    //   min: [0, "quantity can't be negative"],
    //   validate: {
    //     validator: (value) => {
    //       const isInteger = Number.isInteger(value);
    //       if (isInteger) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     },
    //   },
    //   message: 'quantity must be an integer',
    // },

    // ********  status is now in stock model ********
    // status: {
    //   type: String,
    //   enum: {
    //     values: ['in-stock', 'out-of-stock', 'discontinued'],
    //     message: "Status can't be {VALUE}",
    //   },
    // },

    // createdAt: {
    //   type: Date,
    //   default: Date.now(),
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.Now(),
    // },
    // supplier: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Supplier', // using reference to connect to another collection
    // },
    // categories: [
    //   {
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //     _id: mongoose.Schema.Types.ObjectId,
    //   },
    // ],
  },
  {
    timestamps: true, // no need to write abobe createdAt or updatedAt time
  }
);

//  mongoose middlewares for saving data : pre / post
productSchema.pre('save', function (next) {
  console.log('Before saving data');
  if (this.quantity == 0) {
    this.status = 'out-of-stock';
  }

  next();
});

// productSchema.post('save', function (doc, next) {
//   console.log('After saving data');

//   next();
// });

productSchema.methods.logger = function () {
  console.log(`Data save for ${this.name}`);
};

// schema --> model --> query
// model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
