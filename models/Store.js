const mongoose = require('mongoose');
const validator = require('validator');
const { ObjectId } = mongoose.Schema.Types;

const storeSchema = mongoose.Schema(
  {
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
    description: String,
    manager: {
      name: String,
      contactNumber: String,
      id: {
        type: ObjectId,
        ref: 'User',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
