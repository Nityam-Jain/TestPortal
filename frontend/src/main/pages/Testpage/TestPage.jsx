
  
 
import HeroTest from "../../components/Test/HeroTest";
import TestStats from "../../components/Test/TestStats";
import TestCategory from "../../components/Test/TestCategory";
import TestimonialTest from "../../components/Test/TestimonialTest";
import TestCTA from "../../components/Test/TestCTA";
import React from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";


 function TestPage() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#F9F3EF]">
     
      {/* Hero Section */}
      <HeroTest/>

      {/* Quick Stats */}
     <TestStats/>

      {/* Test Categories */}
     
      <TestCategory/>
      {/* Progress Dashboard Preview */}
      

      {/* Testimonials */}
     <TestimonialTest/>

      {/* CTA Section */}
     <TestCTA/>

   <Footer/>
      
    </div>

    </>
  )
}
export default TestPage;