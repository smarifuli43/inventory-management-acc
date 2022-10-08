const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, 'Provide a valid Email'],
      trim: true,
      lowercase: true,
      unique: [true, 'Email already exists'],
      required: [true, 'Email address is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 3,
            minNumbers: 1,
            minUppercase: 1,
            minSymbols: 1,
          }),
        message:
          'Password {VALUE} is not strong enough. please add at least 1 number, 1 uppercase, 1 lowercase, 1 symbol and 6 characters',
      },
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords don't match!",
      },
    },

    role: {
      type: String,
      enum: ['buyer', 'store-manager', 'admin'],
      default: 'buyer',
    },

    firstName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters.'],
      maxLength: [100, 'Name is too large'],
    },
    lastName: {
      type: String,
      required: [true, 'Please provide a first name'],
      trim: true,
      minLength: [3, 'Name must be at least 3 characters.'],
      maxLength: [100, 'Name is too large'],
    },
    contactNumber: {
      type: String,
      validate: [
        validator.isMobilePhone,
        'Please provide a valid contact number',
      ],
    },

    shippingAddress: String,

    imageURL: {
      type: String,
      validate: [validator.isURL, 'Please provide a valid url'],
    },
    status: {
      type: String,
      default: 'inactive',
      enum: ['active', 'inactive', 'blocked'],
    },

    confirmationToken: String,
    confirmationTokenExpires: Date,

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password);
  this.password = hashedPassword;
  this.confirmPassword = undefined; // remove confirmPassword from the database because it is not needed to be stored in the database
  next();
});

userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash);
  return isPasswordValid;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
