import { BookOpen, Clock, Trophy, User } from 'lucide-react';
import React from 'react';

function TestStats() {
  const stats = [
    { icon: <User className="h-8 w-8 text-[#1B3C53]" />, title: '50K+', subtitle: 'Active Users' },
    { icon: <BookOpen className="h-8 w-8 text-[#1B3C53]" />, title: '1,200+', subtitle: 'Test Categories' },
    { icon: <Trophy className="h-8 w-8 text-[#1B3C53]" />, title: '98%', subtitle: 'Satisfaction Rate' },
    { icon: <Clock className="h-8 w-8 text-[#1B3C53]" />, title: '24/7', subtitle: 'Support' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-[#1B3C53]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-[#1B3C53] mb-1">{stat.title}</h3>
              <p className="text-[#456882] text-base">{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestStats;
