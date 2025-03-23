import React from "react";
import { assets, testimonialsData } from "../assets/assets";

const Testimonials = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center my-20 py-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">
          Customer Testimonials
        </h1>
        <p className="text-gray-500 mb-12">
          What our users are saying?
        </p>

        <div className="flex flex-wrap gap-6">
            {testimonialsData.map((testimonail, index) => (
                <div key={index} className="bg-white/20 p-12 rounded-lg shadow-md order w-80 m-auto cursor-pointer hover:scale-[1.02] transition-all">
                    <div className="flex flex-col items-center">
                        <img src={testimonail.image} alt="" className="rounded-full w-14" />
                        <h2 className="text-xl font-semibold mt-3">{testimonail.name}</h2>
                        <p className="text-gray-500 mb-4">{testimonail.role}</p>

                        <div className="flex mb-4">
                            {Array(testimonail.stars).fill().map(() => (
                                <img key={index} src={assets.rating_star} alt="rating_star" />
                            ))}
                        </div>
                        <p className="text-sm text-center text-gray-600">{testimonail.text}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Testimonials;
