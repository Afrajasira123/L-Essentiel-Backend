import { NotFoundError } from "../errors/customErrors.js";
import User from "../models/User.js";

export const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("getUserInfo: userId from token:", userId);
    const user = await User.findById(userId).select("username email phone role").lean();
    console.log("getUserInfo: user found:", user);
    if (!user) throw new NotFoundError("No user found");
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, currentPage } = req.query;
    const queryObject = { role: { $ne: "admin" } };
    if (search && search !== "") {
      const searchRegex = new RegExp(search, "i");
      // queryObject.username = searchRegex; // for querying only single field
      queryObject.$or = [{ username: searchRegex }, { email: searchRegex }];
    }
    const page = Number(currentPage) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const users = await User.find(queryObject)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    const totalUsers = await User.countDocuments(queryObject);
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({ users, totalPages, totalUsers });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};
