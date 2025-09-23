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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                            >
                                {service.image && (
                                    <img
                                        src={`/uploads/${service.image}`}
                                        alt={service.name}
                                        className="h-48 w-full object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold mb-3">{service.name}</h3>
                                    <p className="text-gray-700 mb-4">{service.description}</p>
                                    {service.highlights && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {service.highlights.split(",").map((h, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-slate-200 text-slate-800 text-sm px-3 py-1 rounded-full"
                                                >
                                                    {h.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <span className="font-bold text-lg text-slate-900">₹{service.price}</span>
                                </div>
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
