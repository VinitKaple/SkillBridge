import React, { useState } from "react";
import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", text: "" }); // type: "success" | "error" | "loading"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", text: "Sending your message..." });

    try {
      await axios.post(`${BACKEND_URL}/api/contact/send`, formData);

      setStatus({
        type: "success",
        text: `Thank you ${formData.name}! Your message has been sent. We'll get back to you soon.`,
      });
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setStatus({ type: "", text: "" }), 5000);
    } catch (err) {
      setStatus({
        type: "error",
        text: err.response?.data?.message || "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div>
      <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden">
        <div className="md:flex">
          {/* Left side - Contact Info */}
          <div className="md:w-2/5 bg-gray-50 p-8 text-gray-900">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-4 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">support@skillgrade.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-6 w-6 mr-4 text-gray-700" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">+91 9876543210</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-300">
              <p className="text-sm text-gray-500">Follow us on social media</p>
              <div className="flex space-x-4 mt-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition cursor-pointer">
                  <Facebook className="h-5 w-5 text-gray-700" />
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition cursor-pointer">
                  <Twitter className="h-5 w-5 text-gray-700" />
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition cursor-pointer">
                  <Linkedin className="h-5 w-5 text-gray-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="md:w-3/5 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>

            {/* Status banner */}
            {status.text && (
              <div
                className={`mb-6 p-4 rounded-lg border text-sm ${
                  status.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : status.type === "error"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                {status.type === "loading" && (
                  <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2 align-middle" />
                )}
                {status.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={status.type === "loading"}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status.type === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-6 text-center">
              We respect your privacy. Your information is safe with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;