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
    type: String,
  },
});

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled", "Shipped", "Delivered"],
      default: "Confirmed",
    },
    address: {
      type: AddressSchema,
      required: true,
    },
  },
  { timestamps: true },
);
const Order = model("Order", OrderSchema);
export default Order;
