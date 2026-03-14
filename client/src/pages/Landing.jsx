import React from "react";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-[90px]">
        <Navbar />
        <Features />
        <Footer />
      </div>
    </div>
  );
};

export default Landing;