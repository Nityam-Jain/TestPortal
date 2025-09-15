import React from 'react';
import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Card, CardContent } from './Card';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Developer',
    initial: 'S',
    feedback:
      'TestPortal helped me land my dream job! The programming tests were comprehensive and really prepared me for technical interviews.',
  },
  {
    name: 'Michael Chen',
    role: 'Project Manager',
    initial: 'M',
    feedback:
      'The business management tests gave me the confidence to apply for leadership roles. Excellent platform with great analytics!',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Specialist',
    initial: 'E',
    feedback:
      'As a marketing professional, the digital marketing tests kept me updated with the latest trends and strategies.',
  },
  {
    name: 'Ravi Mehta',
    role: 'Data Analyst',
    initial: 'R',
    feedback:
      'The analytics and machine learning tests helped me refine my skills and boost my resume. Highly recommended!',
  },
  {
    name: 'Priya Nair',
    role: 'HR Specialist',
    initial: 'P',
    feedback:
      'User-friendly interface and excellent content quality. I use TestPortal to evaluate candidates during hiring too!',
  },
];

function TestimonialTest() {
  return (
    <section className="p-7 bg-[#e9e9e9] " >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1B3C53] mb-4">What Our Users Say</h2>
          <p className="text-lg text-[#456882] max-w-2xl mx-auto">
            Join thousands of satisfied learners who have improved their skills with TestPortal
          </p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx} className='p-6'>
              <Card className="bg-white border-0 shadow-md rounded-xl p-5  ">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[#456882] mb-4">"{t.feedback}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#1B3C53] rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {t.initial}
                    </div>
                    <div>
                      <div className="font-medium text-[#1B3C53]">{t.name}</div>
                      <div className="text-sm text-[#456882]">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TestimonialTest;
