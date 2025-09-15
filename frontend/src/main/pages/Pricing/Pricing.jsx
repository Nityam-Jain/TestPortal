import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    description: "Ideal for students trying out TestPortal",
    features: [
      "Access to 5 mock tests",
      "Basic performance report",
      "Limited test categories",
    ],
    buttonText: "Get Started",
    highlight: false,
  },
  {
    name: "Standard",
    price: "₹299/month",
    description: "Perfect for regular test practice",
    features: [
      "Unlimited mock tests",
      "Detailed performance analytics",
      "All test categories unlocked",
      "Email support",
    ],
    buttonText: "Upgrade Now",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₹599/month",
    description: "Advanced features for serious learners",
    features: [
      "Everything in Standard",
      "AI-based recommendations",
      "1-on-1 mentorship sessions",
      "Priority support",
    ],
    buttonText: "Go Pro",
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#F9F3EF] min-h-screen py-16 px-4 sm:px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold">
            <span className="text-[#1B3C53]">Pricing</span>{" "}
            <span className="text-[#456882]">Plans</span>
          </h2>
          <p className="mt-4 text-lg text-[#456882] max-w-2xl mx-auto">
            Choose the plan that fits your learning style and test goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-md p-8 border transition hover:scale-105 hover:shadow-xl ${
                plan.highlight
                  ? "bg-white border-[#456882]"
                  : "bg-[#fffdfb] border-[#D2C1B6]"
              }`}
            >
              <h3 className="text-xl font-bold text-[#1B3C53]">{plan.name}</h3>
              <p className="mt-2 text-3xl font-extrabold text-[#456882]">
                {plan.price}
              </p>
              <p className="mt-2 text-sm text-[#456882]">{plan.description}</p>

              <ul className="mt-6 space-y-3 text-sm text-[#1B3C53]">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${
                  plan.highlight
                    ? "bg-[#456882] text-white hover:bg-[#1B3C53]"
                    : "bg-[#D2C1B6] text-[#1B3C53] hover:bg-[#e5d7ce]"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-[#456882] text-sm">
          Need help choosing a plan?{" "}
          <a href="/contact" className="underline hover:text-[#1B3C53]">
            Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;
