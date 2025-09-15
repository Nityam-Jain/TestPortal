import { ArrowRight } from "lucide-react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import StartTestButton from "./StartTestButton";
import { useState } from "react";

export default function HeroSection() {
  const [showStart, setShowStart] = useState(false);

  return (
    <section className="relative py-30 pt-32  lg:py-32 bg-gradient-to-br from-[#F9F3EF] via-[#D2C1B6] to-[#456882] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge className="mb-6   text-[#1B3C53] hover:bg-[#456882] hover:text-black shadow-md">
          🎓 Test Smarter, Not Harder
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-900 mb-6">
          Empowering Students with{" "}
          <span className=" text-[#1B3C53] bg-clip-text  ">
            Smarter Online Testing
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-navy-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          Practice, evaluate, and improve with AI-powered analytics designed to
          help you succeed in your academic journey.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={() => setShowStart(true)}
            className="bg-gradient-to-r from-navy-900 to-navy-700 hover:from-navy-700 hover:to-navy-500 text-white px-8 py-3 text-lg shadow-lg"
          >
            Start Practicing <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
           {showStart && <StartTestButton />}
        </div>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-navy-500/20 rounded-full blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-navy-300/30 rounded-full blur-[100px] opacity-60 animate-pulse delay-1000" />
      </div>
    </section>
  );
}
