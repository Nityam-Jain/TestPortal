import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("/api/contact");
      setQueries(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch queries:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    try {
      await axios.delete(`/api/contact/${id}`);
      setQueries((prev) => prev.filter((q) => q._id !== id));
      Swal.fire("Deleted!", "Query has been deleted.", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error!", "Failed to delete query.", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contact Queries</h2>

      {loading ? (
        <p className="text-gray-500">Loading queries...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-center px-4 py-3 font-medium text-gray-700">Sr.</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Subject</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-700">Message</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Submitted On</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {queries.map((query, i) => (
                  <tr key={query._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-3 py-2 text-sm md:text-base">{i + 1}</td>
                    <td className="px-3 py-2 text-sm md:text-base">{query.name}</td>
                    <td className="px-3 py-2 text-sm md:text-base">{query.email}</td>
                    <td className="px-3 py-2 text-sm md:text-base">{query.subject}</td>
                    <td className="px-3 py-2 text-sm md:text-base">{query.message}</td>
                    <td className="px-3 py-2 text-sm md:text-base">{new Date(query.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => handleDelete(query._id)}
                        className="p-2 hover:bg-red-100/80 rounded"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3">
            {queries.map((query, i) => (
              <div
                key={query._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-700">#{i + 1}</span>
                  <button
                    onClick={() => handleDelete(query._id)}
                    className="p-2 hover:bg-red-100/80 rounded"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-medium">{query.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium">{query.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Subject</p>
                  <p className="font-medium">{query.subject}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Message</p>
                  <p className="font-medium">{query.message}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Submitted On</p>
                  <p className="font-medium">{new Date(query.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactQueries;
