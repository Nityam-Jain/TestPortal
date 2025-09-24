import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/subscriptions");
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
      }
    };
    fetchPlans();
  }, []);

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
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-md p-8 border transition hover:scale-105 hover:shadow-xl ${plan.planName === "Standard"
                  ? "bg-white border-[#456882]"
                  : "bg-[#fffdfb] border-[#D2C1B6]"
                }`}
            >
              <h3 className="text-xl font-bold text-[#1B3C53]">
                {plan.planName.charAt(0).toUpperCase() + plan.planName.slice(1).toLowerCase()}
              </h3>

              <p className="mt-2 text-3xl font-extrabold text-[#456882]">
                {plan.planName.toLowerCase() === "free"
                  ? `₹${plan.price}`
                  : `₹${plan.price}/month`}
              </p>
              <p className="mt-2 text-sm text-[#456882]">{plan.description}</p>

              <ul className="mt-6 space-y-3 text-sm text-[#1B3C53]">
                {plan.features &&
                  plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      {feature}
                    </li>
                  ))}
              </ul>

              <button
                className={`mt-6 w-full py-3 rounded-xl font-semibold transition ${plan.planName === "Standard"
                    ? "bg-[#456882] text-white hover:bg-[#1B3C53]"
                    : "bg-[#D2C1B6] text-[#1B3C53] hover:bg-[#e5d7ce]"
                  }`}
              >
                {plan.planName === "Free"
                  ? "Get Started"
                  : plan.planName === "Standard"
                    ? "Upgrade Now"
                    : "Go Pro"}
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
