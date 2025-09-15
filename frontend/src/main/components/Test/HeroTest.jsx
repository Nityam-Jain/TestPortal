import React from 'react';
import Button from './Button';
import { Play } from 'lucide-react';

function HeroTest() {
  return (
    <section className="bg-gradient-to-br from-[#1B3C53] to-[#456882] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Master Your Skills with
              <span className="text-[#D2C1B6]"> Smart Testing</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-200">
              Take comprehensive tests, track your progress, and achieve your goals with our intelligent testing platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                className="bg-[#0debf7] text-[#4a7fa5] hover:bg-[#333f5c] hover:text-black "
              >
                <Play className="mr-2 h-5 w-5" />
                Start Testing
              </Button>
              
            </div>
          </div>

          {/* Right Stats Box */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 shadow-lg">
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                {[
                  { label: 'Tests Completed', value: '2,847' },
                  { label: 'Success Rate', value: '94%' },
                  { label: 'Subjects', value: '156' },
                  { label: 'Available', value: '24/7' },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl font-bold text-[#D2C1B6]">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroTest;
