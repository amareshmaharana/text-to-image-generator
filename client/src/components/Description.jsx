import React from "react";

import { assets } from "../assets/assets";

const Description = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
          Create Images by AI
        </h1>
        <p className="text-gray-500 mb-8">
          Turn your imagination into visual arts
        </p>

        <div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center">
          <img
            src={assets.sample_img_1}
            alt="ai_img"
            className="w-80 xl:w-96 rounded-lg"
          />
          <div>
            <h2 className="text-3xl font-medium max-w-lg mb-4">Introducing the AI-powered text to image generator</h2>

            <p className="text-gray-600 mb-4">
              AI text-to-image generators interpret textual prompts, producing
              diverse and imaginative visual content. They empower users to
              create art, design concepts, and marketing materials rapidly.
              These tools democratize visual creation, bridging the gap between
              imagination and tangible imagery, fostering innovation and
              creative exploration across various fields.
            </p>

            <p className="text-gray-600">
              DoodleForge empowers you to transform text into stunning visuals.
              Our AI-powered platform makes image generation accessible, turning
              your creative ideas into reality. Simply describe your vision, and
              watch DoodleForge bring it to life. Explore endless possibilities
              with ease.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Description;
