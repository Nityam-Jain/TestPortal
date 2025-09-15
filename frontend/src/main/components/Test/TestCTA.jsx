import React from 'react';
import Button from './Button';

function TestCTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-[#1B3C53] to-[#456882]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-snug">
          Ready to Start Your Learning Journey?
        </h2>
        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Join thousands of professionals who are advancing their careers with <span className="font-semibold text-white">TestPortal</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg- text-[#1B3C53] hover:bg-[#c6b2a6] transition-colors duration-200"
          >
            Get Started Free
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg hover:text-[#1B3C53] transition-colors duration-200"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}

export default TestCTA;
