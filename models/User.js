import mongoose, { model, Schema } from "mongoose";

const AddressSchema = new Schema({
  name: {
    type: String,
  },
  street: {
    type: String,
  },
  state: {
    type: String,
  },
  pin: {
    type: String,
  },
  country: {
    type: String,
  },
  phone: {
    type: Number,
  },
});

const cartSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  qty: {
    type: Number,
    default: 1,
  },
});

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
    address: {
      type: [AddressSchema],
    },
    defaultAddress: {
      type: AddressSchema,
    },
    orders: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Order",
    },
    cart: {
      type: [cartSchema],
      default: [],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

const User = model("User", UserSchema);
export default User;
