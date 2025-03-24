import FormData from "form-data";
import axios from "axios";

import { User } from "../models/user.model.js";

export const generateImage = async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const user = await User.findById(userId);

    if (!user || !prompt) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (user.creditBalance === 0 || User.creditBalance < 0) {
      return res.status(400).json({
        message: "Insufficient credit",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    // formData.append('creditBalance', user.creditBalance)

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await User.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });
    res.status(200).json({
      creditBalance: user.creditBalance - 1,
      message: "Image created successfully",
      image: resultImage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
