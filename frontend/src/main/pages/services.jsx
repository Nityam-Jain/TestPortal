import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch services from API
    const fetchServices = async () => {
        try {
            const res = await axios.get("/api/services");
            setServices(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <>
            <Navbar />
            <div className="min-h-screen p-6 bg-[#F9F3EF]">
                <h2 className="text-4xl font-bold text-center mb-10">Our Services</h2>
                <div>

                    <p className="mt-4 text-lg text-[#456882] max-w-2xl mx-auto text-center mb-12">
                        Explore our range of services designed to make your experience seamless and enjoyable.
                    </p>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500 mt-12">Loading services...</p>
                ) : services.length === 0 ? (
                    <p className="text-center text-gray-500 mt-12">No services available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="
            relative 
            rounded-2xl 
            overflow-hidden 
            shadow-2xl
            bg-white/80
            backdrop-blur-lg
            border border-slate-100 
            hover:shadow-3xl
            hover:-translate-y-2
            transition-all
            duration-300
            p-0
          "
                                style={{
                                    background:
                                        "linear-gradient(135deg, #f5f8fe 60%, #eaf3fc 100%)"
                                }}
                            >
                                {service.image && (
                                    <img
                                        src={`/uploads/${service.image}`}
                                        alt={service.name}
                                        className="h-48 w-full object-cover rounded-b-none drop-shadow-md"
                                    />
                                )}
                                <div className="p-7">
                                    <h3 className="text-2xl font-semibold mb-2 text-slate-800">
                                        {service.name}
                                    </h3>
                                    <p className="text-gray-700 mb-3 line-clamp-2">
                                        {service.description}
                                    </p>
                                    {service.highlights && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {service.highlights.split(",").map((h, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-slate-200 text-slate-800 text-xs px-3 py-1 rounded-full shadow"
                                                >
                                                    {h.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <span className="font-bold text-lg text-blue-700 bg-blue-50 px-2 py-1 rounded shadow">
                                        ₹{service.price}
                                    </span>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-blue-200 via-slate-100 to-blue-200 opacity-80 rounded-b-2xl pointer-events-none" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default UserServices;
