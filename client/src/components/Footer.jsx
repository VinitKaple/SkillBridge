import React from "react";
import { Phone, Mail, ShieldCheck, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-blue-700 text-gray-300 font-inter">
      {/* Top CTA Section */}
      <div className="border-b border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          
          {/* Developed By */}
          <div className="flex items-center justify-center sm:justify-start">
            <ShieldCheck className="text-orange-500 w-8 h-8" />
            <div className="ml-3">
              <h4 className="text-white text-lg font-semibold">Developed By</h4>
              <span className="text-sm">  ~@VinitKaple </span>
            </div>
          </div>

          {/* Call Us */}
          <div className="flex items-center justify-center">
            <Phone className="text-orange-500 w-8 h-8" />
            <div className="ml-3">
              <h4 className="text-white text-lg font-semibold">24x7 Banking Support</h4>
              <span className="text-sm">
                <a href="tel:+91-8591040081" className="text-blue-300 hover:underline">
                  1800-123-456 (Toll Free)
                </a>
              </span>
            </div>
          </div>

          {/* Mail Us */}
          <div className="flex items-center justify-center sm:justify-end">
            <Mail className="text-orange-500 w-8 h-8" />
            <div className="ml-3">
              <h4 className="text-white text-lg font-semibold">Email Support</h4>
              <span className="text-sm">vinitskaple@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-8 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 text-center md:text-left">
        
        {/* Logo + About */}
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm leading-relaxed text-gray-300">
           Our team, Deployed Kings, is committed to building reliable, scalable, and intelligent technology that enhances customer experience, strengthens financial ecosystems, and drives meaningful digital transformation.
          </p>
          <div className="mt-4">
            <span className="text-white font-semibold block mb-2">Connect With Our Team</span>
          <div className="flex gap-3 flex-wrap justify-center md:justify-start">
  {/* Alok */}
  <a 
    href="https://www.linkedin.com/in/alok-jha-933943357" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"

  >
    A
  </a>

  {/* Vinit */}
  <a 
    href="https://www.linkedin.com/in/vinitkaple0718" 
    target="_blank" 
    rel="noopener noreferrer" 
   className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"

  >
    V
  </a>

  {/* Ravi */}
  <a 
    href="https://www.linkedin.com/in/ravishankar-kanaki-355661269" 
    target="_blank" 
    rel="noopener noreferrer" 
   className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:scale-110 hover:shadow-lg transition-all duration-300"

  >
    R
  </a>
</div>

          </div>
        </div>

        {/* Services & Help */}
        <div className="m-auto flex flex-col items-center md:items-start px-6 space-y-4">
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">More Services</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/dashboard" className="text-blue-300 hover:underline">API Integration Support</a></li>
              <li><a href="/analytics" className="text-blue-300 hover:underline">Advertising & Insights</a></li>
              <li><a href="/compliance" className="text-blue-300 hover:underline">AI Compliance</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">Emergency Help</h3>
            <ul className="text-sm space-y-1">
              <li>Lost Card: <a href="tel:1800112211" className="text-blue-300 hover:underline">1800-11-2211</a></li>
              <li>Fraud: <a href="tel:155260" className="text-blue-300 hover:underline">155260</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white text-lg font-semibold mb-4">Disclaimer & Compliance</h3>
          <p className="text-sm leading-relaxed text-gray-300">
           This website was developed for Hackanova hackathon.

During the development phase, all names, data, references, and scenarios used on this platform are entirely fictional, simulated, or generated by AI for demonstration purposes only. Any resemblance to real individuals, organizations, banks, or entities is purely coincidental and unintended.
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center text-sm text-black text-center font-medium">
          <p>© {new Date().getFullYear()} APICA – Agentic AI </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;