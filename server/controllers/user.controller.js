import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import razorpay from "razorpay";

import { User } from "../models/user.model.js";
import { Transaction } from "../models/transaction.model.js";

/* REGISTER USER */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // password hashing for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // collections of userdata
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // saving data of user in mongodb
    const user = await User.create(userData);
    // const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

    res.json({ success: true, token, user: { name: user.name } });
  } catch (error) {
    console.error("ERROR :: ", error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
};

/* LOGIN USER */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      res.json({ success: true, token, user: { name: user.name } });
    } else {
      return res.status(400).json({ message: "Invalid credentials!!" });
    }
  } catch (error) {
    console.error("ERROR :: ", error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
};

/* USER CREDITS */
export const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log("ERRROR :: ", error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
};

/* RAZORPAY PAYMENT */
export const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazorpay = async (req, res) => {
  try {
    const { userId, planId } = req.body;

    const userData = await User.findById(userId);

    if (!userId || !planId) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let credits, plan, amount, date;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 50;
        break;

      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 100;
        break;

      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;

      default:
        return res.json({ success: false, message: "Invalid Plan" });
        break;
    }

    date = Date.now();

    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date,
      payment: false,
    };

    const newTransaction = await Transaction.create(transactionData);
    await newTransaction.save();

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };

    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log("ERROR :: ", error);
        return res.json({ success: false, message: error.message });
      }
      res.json({ success: true, order: order });
    });
  } catch (error) {
    console.log("ERROR :: ", error);
    res.json({ success: false, message: error.message });
  }
};

/* VERIFYING RAZORPAY PAYMENT */
export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const transactionData = await Transaction.findById(orderInfo.receipt);
      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment failed" });
      }

      const userData = await User.findById(transactionData.userId);

      const creditBalance = userData.creditBalance + transactionData.credits;
      await User.findByIdAndUpdate(userData._id, {
        creditBalance,
      });

      await Transaction.findByIdAndUpdate(transactionData._id, {payment: true})

      res.json({ success: true, message: "Payment successful" });
    } else {
      return res.json({ success: false, message: "Payment failed" });
    }

  } catch (error) {
    console.log("ERRROR :: ", error);
    res.json({ success: false, message: error.message });
  }
};
