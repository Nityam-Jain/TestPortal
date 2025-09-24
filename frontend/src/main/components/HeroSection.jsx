import { ArrowRight } from "lucide-react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import StartTestButton from "./StartTestButton";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HeroSection() {
  const [showStart, setShowStart] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/admin/banners");
        if (res.data && res.data.length > 0) {
          setBanners(res.data.map((b) => `/uploads/${b.image}`));
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000); // 5 seconds
      return () => clearInterval(interval);
    }
  }, [banners]);

  return (
    <section className="relative py-30 pt-32 lg:py-32 overflow-hidden">
      {/* Background banners */}
      <div className="absolute inset-0 -z-10">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              style={{
                backgroundImage: `url(${banner})`,
                backgroundSize: "cover", 
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay for text visibility */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#F9F3EF] via-[#D2C1B6] to-[#456882]">
            <div className="absolute inset-0 bg-black/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Badge className="mb-6 text-[#1B3C53] hover:bg-[#456882] hover:text-black shadow-md">
          🎓 Test Smarter, Not Harder
        </Badge>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          Empowering Students with{" "}
          <span className="text-[#FFD700] bg-clip-text">
            Smarter Online Testing
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
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

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentIndex === index
                  ? "bg-white scale-125"
                  : "bg-gray-400 hover:bg-gray-300"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
