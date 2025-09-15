import React, { useEffect, useRef, useState } from "react";
 
const stats = [
  {   number: 10000, label: "Active Users", suffix: "+" },
  {   number: 20000, label: "Tests Created", suffix: "+" },
  {   number: 99.9, label: "Uptime", suffix: "%" },
  {   number: 150, label: "Countries", suffix: "+" },
];

const useInView = (ref) => {
  const [isInView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.6 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);
  return isInView;
};

const Counter = ({ end, suffix, isInView }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(end / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(interval);
        setCount(end);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [isInView, end]);
  return (
    <div className="text-4xl lg:text-5xl font-bold text-[#1B3C53] transition-all duration-500">
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

export default function Statistics() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="relative py-24  bg-slate-300  overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute -top-20 -left-10 w-96 h-96 bg-[#D2a1B6]/30 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#456382]/20 rounded-full blur-3xl z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1B3C53] mb-4">Trusted by Thousands Worldwide</h2>
          <p className="text-xl text-[#456882] max-w-2xl mx-auto">
            Join the growing community of students, educators, and organizations using TestPortal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl text-center transition-all duration-300 transform hover:scale-105"
            >
              <div className="mb-4">{stat.icon}</div>
              <Counter end={stat.number} suffix={stat.suffix} isInView={isInView} />
              <div className="text-[#456882] text-lg mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
