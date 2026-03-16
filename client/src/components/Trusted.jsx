import React from "react";

const Trusted = () => {
  const logos = ["/one.png", "/two.png", "/three.png", "/four.jpg", "/six.jpg", "/five.jpg"];

  return (
    <section className="mt-12 relative">
      <h3 className="text-center text-xl md:text-2xl font-semibold text-gray-700 mb-6">
        Trusted By Engineering Colleges
      </h3>

      <div className="relative w-full overflow-hidden">
        <div className="mx-auto max-w-4xl overflow-hidden relative">
          
          <div className="flex w-max animate-scroll">
            {[...logos, ...logos].map((logo, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-48 h-24 flex items-center justify-center px-6"
              >
                <img
                  src={logo}
                  alt={`logo ${idx}`}
                  className="max-h-16 object-contain"
                />
              </div>
            ))}
          </div>

          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-blue-50 to-transparent pointer-events-none"></div>

        </div>
      </div>
    </section>
  );
};

export default Trusted;