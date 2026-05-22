import { body, param, validationResult } from "express-validator";
import { BadRequestError } from "../errors/customErrors.js";
import User from "../models/User.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};
export const validateRegister = withValidationErrors([
  body("username").notEmpty().withMessage("Username is Required"),
  body("password").notEmpty().withMessage("password is Required"),
  body("email")
    .notEmpty()
    .withMessage("email is Required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (email) => {
      const isAlreadyExist = await User.findOne({ email: email });
      if (isAlreadyExist) throw new BadRequestError("Email already exists");
    }),

  body("phone").notEmpty().withMessage("phone is Required"),
]);

export const validateLogin = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is Required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom(async (email) => {
      if (!user) throw new BadRequestError("No user found");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new BadRequestError("invalid credentials");
    }),
  body("password").notEmpty().withMessage("password is Required"),
]);


export const validateAddBrand = withValidationErrors([
  body("brandName").notEmpty().withMessage("Brand Name is Required"),
]);

export const validateAddCategory = withValidationErrors([
  body("categoryName").notEmpty().withMessage("Category Name is Required"),
]);

export const validateAddProduct = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("stock").notEmpty().withMessage("stock is Required"),
  body("description").notEmpty().withMessage("description is Required"),
  body("category").notEmpty().withMessage("category is Required"),
  body("price").notEmpty().withMessage("price is Required"),
  body("brand").notEmpty().withMessage("brand is Required"),
  body("isFeatured").optional().isBoolean().withMessage("isFeatured must be a boolean"),
]);

export const validateAddToCart = withValidationErrors([
  body("productId").notEmpty().withMessage("id is required").isMongoId().withMessage("Invalid id"),
]);

export const validateUpdateCart = withValidationErrors([
  body("itemId").notEmpty().withMessage("id is required").isMongoId().withMessage("Invalid id"),
  body("qty").notEmpty().withMessage("qty is required"),
]);
export const validateRemoveCart = withValidationErrors([
  body("itemId").notEmpty().withMessage("id is required").isMongoId().withMessage("Invalid id"),
]);

export const validateAddAddress = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required"),
  body("street").notEmpty().withMessage("street is Required"),
  body("state").notEmpty().withMessage("state is Required"),
  body("pin").notEmpty().withMessage("pin is Required"),
  body("phone").notEmpty().withMessage("phone is Required"),
  body("country").notEmpty().withMessage("country is Required"),
]);

export const validateOrder = withValidationErrors([
  body("address").notEmpty().withMessage("address is Required"),
]);

export const validateUpdateOrder = withValidationErrors([
  body("orderId").notEmpty().withMessage("id is required").isMongoId().withMessage("Invalid id"),
]);

export const validateAddToWishlist = withValidationErrors([
  body("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("Invalid product id"),
]);

export const validateRemoveFromWishlist = withValidationErrors([
  param("productId")
    .notEmpty()
    .withMessage("productId is required")
    .isMongoId()
    .withMessage("Invalid product id"),
]);
