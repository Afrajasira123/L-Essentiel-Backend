import { NotFoundError } from "../errors/customErrors.js";
import User from "../models/User.js";

export const getAddresses = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");

    const defaultAddress = user.address.find((addr) => addr && addr.isDefault === true) || null;

    res.status(200).json({
      address: user.address, // matches your current response key
      defaultAddress: defaultAddress,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const { name, street, state, pin, country, phone } = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    const newAddress = {
      name,
      street,
      state,
      pin,
      country,
      phone,
    };
    if (user.address.length > 1) user.defaultAddress = newAddress;
    user.address.push({
      name: name,
      street: street,
      state: state,
      pin: pin,
      country: country,
      phone: phone,
    });
    await user.save();
    res.status(200).json({ message: "Address added successfully", address: user.address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { name, street, state, pin, country, phone } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    const address = user.address.find((addr) => addr && addr._id.toString() === id);
    if (!address) {
      throw new NotFoundError("Address not found");
    }
    if (name) address.name = name;
    if (street) address.street = street;
    if (state) address.state = state;
    if (pin) address.pin = pin;
    if (country) address.country = country;
    if (phone) address.phone = phone;

    await user.save();
    res.status(200).json({ message: "updated successfully", address: user.address });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    user.address = user.address.filter((addr) => addr._id.toString() !== id);
    await user.save();
    res.status(200).json({
      message: "Address removed successfully",
      address: user.address,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("No user found");
    const address = user.address.find((addr) => addr && addr._id.toString() === id);
    if (!address) {
      throw new NotFoundError("Address not found");
    }
    user.address.forEach((addr) => {
      if (addr) addr.isDefault = false;
    });

    address.isDefault = true;
    await user.save();
    res.status(200).json({
      message: "Default address set successfully",
      address: user.address,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
