"use client";

import React, { useState } from "react";
import {
  MdSend,
  MdEmail,
  MdPhone,
  MdChatBubbleOutline,
  MdLocationOn,
  MdAccessTime,
  MdQuestionAnswer,
} from "react-icons/md";

function ContactUs() {
  const [category, setCategory] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: fullName.trim() ? "" : "Full Name is required",
      email: email.trim()
        ? validateEmail(email)
          ? ""
          : "Invalid email"
        : "Email is required",
      subject: subject.trim() ? "" : "Subject is required",
      message: message.trim() ? "" : "Message is required",
      category: category.trim() ? "" : "Select a category",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => err === "")) {
      alert("Message sent successfully!");
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setErrors({ fullName: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="bg-gray-100 p-8 font-sans">
      <div className="bg-white p-8 rounded-lg max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
          <p className="text-gray-600 text-base">
            We're here to help with any questions about our products or your
            sustainable journey
          </p>
        </div>

        <div className="h-px bg-gray-200 my-6" />

        {/* Contact Form */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MdSend className="text-green-600 text-2xl mr-2" />
            <h2 className="text-xl font-bold">Send us a Message</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name + Email Row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col mb-4">
                <label
                  htmlFor="fullName"
                  className="font-semibold text-sm mb-1"
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  className={`p-2 border rounded-md text-base ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col mb-4">
                <label htmlFor="email" className="font-semibold text-sm mb-1">
                  Email Address *
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="Enter your email"
                  className={`p-2 border rounded-md text-base ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="flex flex-col mb-4">
              <label htmlFor="category" className="font-semibold text-sm mb-1">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-base"
              >
                <option value="" disabled hidden>
                  Select a category
                </option>
                <option value={10}>Order Inquiry</option>
                <option value={20}>Product Information</option>
                <option value={30}>Sustainability</option>
              </select>

              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.category}
                </span>
              )}
            </div>

            {/* Subject */}
            <div className="flex flex-col mb-4">
              <label htmlFor="subject" className="font-semibold text-sm mb-1">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                placeholder="Brief description of your inquiry"
                className={`p-2 border rounded-md text-base ${
                  errors.subject ? "border-red-500" : "border-gray-300"
                }`}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {errors.subject && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.subject}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col mb-4">
              <label htmlFor="message" className="font-semibold text-sm mb-1">
                Message *
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Please provide details about your inquiry..."
                className={`p-2 border rounded-md text-base resize-vertical ${
                  errors.message ? "border-red-500" : "border-gray-300"
                }`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white p-3 rounded-md font-bold w-full hover:opacity-90 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Get in Touch */}
      <div className="my-24">
        <h2 className="text-xl font-bold mb-4">Get in Touch</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex p-4 bg-white rounded-md border border-gray-200 items-start gap-4">
            <MdEmail className="text-green-600 text-3xl" />
            <div>
              <p className="font-bold">Email Support</p>
              <p className="text-gray-600">
                Get help with orders, returns, and general questions
              </p>
              <p className="text-green-600">support@ecomarket.com</p>
              <p className="text-gray-500 text-sm">24-48 hours</p>
            </div>
          </div>
          <div className="flex p-4 bg-white rounded-md border border-gray-200 items-start gap-4">
            <MdPhone className="text-green-600 text-3xl" />
            <div>
              <p className="font-bold">Phone Support</p>
              <p className="text-gray-600">
                Speak directly with our customer service team
              </p>
              <p className="text-green-600">+1 (555) 123-4567</p>
              <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM EST</p>
            </div>
          </div>
          <div className="flex p-4 bg-white rounded-md border border-gray-200 items-start gap-4">
            <MdChatBubbleOutline className="text-green-600 text-3xl" />
            <div>
              <p className="font-bold">Live Chat</p>
              <p className="text-gray-600">Instant help for urgent questions</p>
              <p className="text-green-600">Available on website</p>
              <p className="text-gray-500 text-sm">Mon-Fri, 9AM-6PM EST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Us Section */}
      <div className="my-24">
        <div className="flex items-center mb-4">
          <MdLocationOn className="text-green-600 text-3xl mr-2" />
          <h2 className="text-xl font-bold">Visit Us</h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-md p-6">
          {/* Address */}
          <div className="mb-6">
            <p className="font-bold">EcoMarket Headquarters</p>
            <p className="text-gray-600">123 Sustainable Street</p>
            <p className="text-gray-600">Green Valley, CA 94042</p>
            <p className="text-gray-600">United States</p>
          </div>
          <div className="h-px bg-gray-200 mb-6"></div>
          {/* Business Hours */}
          <div className="flex items-start gap-4">
            <MdAccessTime className="text-green-600 text-2xl mt-1" />
            <div>
              <p className="font-bold mb-2">Business Hours</p>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM PST
              </p>
              <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM PST</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="my-24">
        <div className="flex items-center mb-4">
          <MdQuestionAnswer className="text-green-600 text-2xl mr-2" />
          <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              question: "What makes your products eco-friendly?",
              answer:
                "All our products are carefully vetted for sustainability...",
            },
            {
              question: "Do you offer international shipping?",
              answer: "Yes, we ship to over 50 countries worldwide...",
            },
            {
              question: "What is your return policy?",
              answer: "We offer a 30-day return policy...",
            },
            {
              question: "How do you ensure product quality?",
              answer: "We work directly with certified suppliers...",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white p-4 border border-gray-200 rounded-md"
            >
              <p className="font-bold mb-2">{faq.question}</p>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-2">
            Can't find what you're looking for?
          </p>
          <button className="border border-gray-300 rounded-md px-4 py-2 bg-white text-black hover:bg-green-50 hover:border-green-600 hover:text-green-600 transition">
            View All FAQs
          </button>
        </div>
      </div>

      {/* Response Time Footer */}
      <div className="bg-green-50 p-6 rounded-md text-center">
        <div className="flex justify-center items-center mb-2 gap-2">
          <MdAccessTime className="text-green-600 text-2xl" />
          <p className="font-bold text-base">
            Average Response Time: 2-4 hours during business hours
          </p>
        </div>
        <p className="text-gray-600 text-sm">
          We're committed to providing excellent customer service and will
          respond to your inquiry as quickly as possible.
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
