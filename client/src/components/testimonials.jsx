import React from "react";
import { testimonialsData } from "../assets/testimonials"; // adjust path as needed

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-10">
      <div className="container mx-auto px-4 ">
        <h2 className="text-3xl font-bold text-center mb-6 ">
          Success Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 shadow-md rounded-2xl bg-white"
            >
              <div className="pt-4">
                <div className="flex items-center mb-4">
                  {/* Image from public folder */}
                  <img
                    src={`/${testimonial.image}`} // Place these images in /public folder
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
