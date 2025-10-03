import React, { useState, useEffect } from "react";
import { Search, Eye, Download } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const InstituteResults = () => {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  const token = sessionStorage.getItem("instituteToken");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get("/api/institute/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch results", "error");
    }
  };

  const filteredResults = results.filter(
    (r) =>
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.testName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Results</h1>
      <p className="text-gray-600 mb-6">
        View and manage results of tests conducted by your institute
      </p>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by student or test"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Results Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Test</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((r) => (
                <tr key={r._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.studentName}</td>
                  <td className="px-4 py-3">{r.testName}</td>
                  <td className="px-4 py-3">{r.score}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "Passed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstituteResults;
