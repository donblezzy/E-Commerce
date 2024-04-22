import ErrorHandler from "../Utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import User from "../models/user.js";

// Register USER => /api/register
export const registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
});

// Login USER => /api/login
export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }


  // Find User in the database
  const user = await User.findOne({ email }).select("+password")

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password)
  
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }


  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
});
