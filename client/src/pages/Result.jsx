import React, { useContext, useState } from "react";
import { motion } from "motion/react";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const [image, setImage] = useState(assets.sample_img_1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  const { generateImage } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (input) {
      const image = await generateImage(input);
      if (image) {
        setIsImageLoaded(true);
        setImage(image);
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={onSubmitHandler}
        className="flex flex-col min-h-[90vh] justify-center items-center"
      >
        <div>
          <div className="relative">
            <img src={image} alt="" className="max-w-sm rounded" />
            <span
              className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
                isLoading ? "w-full transition-all duration-[10s]" : "w-0"
              }`}
            />
          </div>
          <p className={!isLoading ? "hidden" : ""}>Loading........</p>
        </div>

        {!isImageLoaded && (
          <div className="flex w-full max-w-xl bg-gray-300 text-white text-sm p-0.4 mt-10 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Describe your imagination................"
              className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 text-black"
            />
            <button
              onSubmit={onSubmitHandler}
              type="submit"
              className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
            >
              Generate
            </button>
          </div>
        )}

        {/* after generating for download and go to another page */}
        {isImageLoaded && (
          <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
            <p
              onClick={() => {
                setIsImageLoaded(false);
              }}
              className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
            >
              Generate Another
            </p>
            <a
              href={image}
              download
              className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
            >
              Download
            </a>
          </div>
        )}
      </motion.form>
    </>
  );
};

export default Result;
