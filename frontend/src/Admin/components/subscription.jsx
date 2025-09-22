
import React from "react";

const Banner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome to Admin Dashboard</h1>
      <p className="text-lg md:text-xl text-gray-100">
        This is your banner section. More functionality will be added here soon.
      </p>
    </div>
  );
};

export default Banner;
