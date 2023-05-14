import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    if (!name) {
      return res.send({ success: false, message: "Name required!!!" });
    }
    if (!email) {
      return res.send({ success: false, message: "Email required!!!" });
    }
    if (!password) {
      return res.send({ success: false, message: "Password required!!!" });
    }
    if (!address) {
      return res.send({ success: false, message: "Address required!!!" });
    }
    if (!phone) {
      return res.send({ success: false, message: "Phone required!!!" });
    }

    //check if user already exits
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "You have alredy Registered, please login",
      });
    }

    //register new user
    const hashedPassword = await hashPassword(password);
    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    //check user in DB
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Email is not registered",
      });
    }

    //compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const testController = (req, res) => {
  try {
    res.status(201).send({
      success: true,
      message: "Protected routes accessed",
    });
  } catch (error) {
    
  }
};

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) { 
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//place order of the user
export const placeOrderController = async (req, res) => {
  try {
    const { cart } = req.body;
    const order = new orderModel({
      products: cart,
      payment: { success: true },
      buyer: req.user._id,
    }).save();
    res.status(200).send({
      success: true,
      message: "Order placed succeffuly",
    });
  } catch (error) {
    
    res.status(200).send({
      success: false,
      error,
    });
  }
};

//get all orders of a user
export const getUserOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-image")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
    });
  }
};

//get all orders details for admin
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-image")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {   
    res.status(500).send({
      success: false,
      error,
    });
  }
};

//order status update by admin
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {   
    res.status(500).send({
      success: false,
      error,
    });
  }
};
