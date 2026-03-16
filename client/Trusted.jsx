import React from "react";

const Trusted = () => {
  // Four different bank logos
const logos = ["/one.png", "/two.png", "/three.png", "/four.jpg","/five.jpg","/six.jpg"];


  return (
    <section className="mt-12 relative">
      <h3 className="text-center text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Trusted By Banks
      </h3>

      {/* Scrolling Logos */}
      <div className="relative w-full overflow-hidden">
        {/* constrain width on lg+ */}
        <div className="mx-auto max-w-4xl overflow-hidden relative">
          <div className="flex animate-scroll">
            {/* Repeat logos array to make scroll seamless */}
            {[...logos, ...logos].map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-48 h-30 flex items-center justify-center px-6"
              >
                <img
                  src={logo}
                  alt={`Bank logo ${idx + 1}`}
                  className="max-h-16 object-contain transition"
                />
              </div>
            ))}
          </div>

          {/* Gradient fade on sides matching hero background */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Trusted;
