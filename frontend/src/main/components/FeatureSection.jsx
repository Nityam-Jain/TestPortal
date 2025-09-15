import React from "react";
import {
  Zap,
  Shield,
  BarChart3,
  Users,
  Clock,
  Award,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../Card";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: "Lightning Fast",
    description:
      "Create tests in minutes with our intuitive drag-and-drop interface and smart templates.",
    bg: "bg-[#1B3C53]",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with 99.9% uptime and end-to-end data encryption.",
    bg: "bg-[#1B3C53]",
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-white" />,
    title: "Advanced Analytics",
    description:
      "Gain insights into test performance with AI-powered reporting and score tracking.",
    bg: "bg-[#1B3C53]",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Team Collaboration",
    description:
      "Enable collaborative test creation with real-time updates and role-based permissions.",
    bg: "bg-[#1B3C53]",
  },
  {
    icon: <Clock className="w-8 h-8 text-white" />,
    title: "Time Management",
    description:
      "Advanced timing controls with countdowns, auto-save, and test scheduling options.",
    bg: "bg-[#1B3C53]",
  },
  {
    icon: <Award className="w-8 h-8 text-white" />,
    title: "Certification Ready",
    description:
      "Automatically generate certificates with custom templates and secure QR validation.",
   bg: "bg-[#1B3C53]",
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative py-24 bg-gradient-to-br from-[#F9F3EF] via-[#E6EEF5]/60 to-[#D2E6F8]/40 overflow-hidden"
    >
      {/* Blurred background blobs */}
 
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-4 tracking-tight">
            Everything You Need to Create Amazing Tests
          </h2>
          <p className="text-xl text-navy-700 max-w-2xl mx-auto">
            Powerful features designed to make test creation, management, and
            analysis effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border border-transparent hover:border-navy-300 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader>
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.bg} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-navy-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-navy-700 text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
