import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is TestPortal?",
    answer:
      "TestPortal is an online platform that allows students to take mock exams, view analytics, and track their academic performance in real-time.",
  },
  {
    question: "How do I register for a test?",
    answer:
      "You can register for a test by logging into your account, navigating to the 'Tests' section, and selecting your preferred test.",
  },
  {
    question: "Is TestPortal free to use?",
    answer:
      "TestPortal offers both free and premium plans. Free users can access limited mock tests, while premium users get full access to advanced analytics and unlimited tests.",
  },
  {
    question: "Can I see my performance analytics?",
    answer:
      "Yes! After each test, you'll get detailed statistics like score, accuracy, time taken, topic-wise performance, and rank.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-6 py-12">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 text-[#1B3C53]">
        Frequently Asked <span className="text-[#456882]">Questions</span>
      </h2>

      <div className="space-y-4 ">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-[#D2C1B6] rounded-xl overflow-hidden shadow-sm transition"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-3 bg-[#F9F9F9] hover:bg-[#F1F1F1] text-left"
            >
              <span className="text-lg font-medium text-[#1B3C53]">
                {faq.question}
              </span>
              <span className="text-[#456882]">
                {openIndex === index ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </span>
            </button>

            <div
              className={`px-5 pt-0 pb-4 text-[#456882] text-sm transition-all duration-300 ease-in-out ${
                openIndex === index ? "block" : "hidden"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
