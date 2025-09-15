import { useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { CheckCircle } from "lucide-react";

export default function CTASection() {

  const navigate = useNavigate();

  const handleStart = () => {
  navigate("/Login");  
};
  return (
    <section className="relative py-14 bg-gradient-to-br  bg-gray-200 overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute -top-24 -left-16 w-96 h-96 bg-[#456882]/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1B3C53]/10 rounded-full blur-3xl z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-[#13598c] mb-6 leading-tight">
          Ready to transform your testing experience?
        </h2>
        <p className="text-xl text-[#456882] mb-10 max-w-2xl mx-auto">
          Join thousands of educators and organizations who trust TestPortal for their testing needs.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
          <Button
            size="lg"
            onClick={handleStart}
            className="bg-gradient-to-r from-[#1B3C53] to-[#456882] hover:from-[#1B3C53]/90 hover:to-[#456882]/90 text-lg px-8 py-3 text-white font-semibold rounded-xl shadow-xl transition-all duration-300"
          >
            Start Your Free Trial
          </Button>
         
        </div>

       
      </div>
    </section>
  );
}
