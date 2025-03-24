import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    res.status(201).json({ token, user: { name: user.name } });
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
      return res.status(404).json({ message: "User does not exist!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      res.status(201).json({ token, user: { name: user.name } });
    } else {
        return res.status(400).json({message: "Invalid credentials!!"})
    }
  } catch (error) {
    console.error("ERROR :: ", error);
    res.status(500).json({ message: "Something went wrong!!!" });
  }
};

/* USER CREDITS */
export const userCredits = async (req, res) => {
  try {
    const {userId} = req.body

    const user = await User.findById(userId)
    res.status(200).json({credits: user.creditBalance, user: {name: user.name}})

  } catch (error) {
    console.log("ERRROR :: ", error)
    res.status(500).json({message: "Something went wrong!!!"})
  }
}