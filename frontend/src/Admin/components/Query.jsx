import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, CheckCircle, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Search
  const [search, setSearch] = useState("");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchQueries = async () => {
    try {
      const res = await axios.get("/api/contact");
      const data = res.data.data || res.data;

      setQueries(data);
      setFiltered(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch queries:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // 🔎 LIVE SEARCH FILTER
  useEffect(() => {
    const s = search.toLowerCase();

    const f = queries.filter(
      (q) =>
        q.name.toLowerCase().includes(s) ||
        q.email.toLowerCase().includes(s) ||
        q.subject.toLowerCase().includes(s)
    );

    setFiltered(f);
    setCurrentPage(1);
  }, [search, queries]);

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Update Status
  const handleStatusUpdate = async (id) => {
    try {
      await axios.patch(`/api/contact/${id}/status`, {
        status: "solved",
      });

      setQueries((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: "solved" } : q))
      );

      Swal.fire("Updated!", "Status changed to solved.", "success");
    } catch (err) {
      console.error("Status update failed:", err);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  // 🗑 DELETE with SWEETALERT CONFIRMATION
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This query will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/contact/${id}`);
      setQueries((prev) => prev.filter((q) => q._id !== id));

      Swal.fire("Deleted!", "Query has been deleted.", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error!", "Failed to delete query.", "error");
    }
  };

  // Modal
  const openDetailModal = (query) => {
    setSelectedQuery(query);
    setOpenModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Queries</h2>

      {/* 🔎 SEARCH BAR */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name, Email or Subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 border px-3 py-2 rounded-md shadow-sm"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading queries...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-center px-4 py-3 font-medium">Sr.</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Subject</th>
                  <th className="px-4 py-3 text-center font-medium">Message</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Submitted On</th>
                  <th className="text-center px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {currentItems.map((query, i) => (
                  <tr key={query._id}>
                    <td className="px-3 py-3 text-center">
                      {(currentPage - 1) * itemsPerPage + i + 1}
                    </td>

                    <td
                      onClick={() => openDetailModal(query)}
                      className="px-3 py-3 cursor-pointer"
                    >
                      {query.name}
                    </td>

                    <td
                      onClick={() => openDetailModal(query)}
                      className="px-3 py-3 cursor-pointer"
                    >
                      {query.email}
                    </td>

                    <td className="px-3 py-3">{query.subject}</td>

                    <td className="px-3 py-3 max-w-[200px] truncate">
                      {query.message}
                    </td>

                    <td className="px-3 py-3">
                      {query.status === "pending" ? (
                        <button
                          onClick={() => handleStatusUpdate(query._id)}
                          className="px-3 py-1.5 bg-red-100 text-black rounded-md"
                        >
                          Pending
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" /> Solved
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => handleDelete(query._id)}
                        className="p-2 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-3">
            {currentItems.map((q, i) => (
              <div key={q._id} className="bg-white shadow rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </span>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="p-2 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                <p>
                  <span className="text-gray-500">Name: </span>
                  <span
                    className="text-blue-600 underline"
                    onClick={() => openDetailModal(q)}
                  >
                    {q.name}
                  </span>
                </p>

                <p>
                  <span className="text-gray-500">Email: </span>
                  <span
                    className="text-blue-600 underline"
                    onClick={() => openDetailModal(q)}
                  >
                    {q.email}
                  </span>
                </p>

                <p><span className="text-gray-500">Subject: </span>{q.subject}</p>

                <p className="text-sm truncate">
                  <span className="text-gray-500">Message: </span>
                  {q.message}
                </p>

                <p className="text-sm">
                  <span className="text-gray-500">Submitted: </span>
                  {new Date(q.createdAt).toLocaleDateString()}
                </p>

                {q.status === "pending" ? (
                  <button
                    onClick={() => handleStatusUpdate(q._id)}
                    className="px-3 py-1.5 bg-red-100 text-black rounded-md"
                  >
                    Pending
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Solved
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="flex justify-center items-center gap-6 py-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-1.5 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            <span className="text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-1.5 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {openModal && selectedQuery && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" /> Query Details
            </h3>

            <p><strong>Name:</strong> {selectedQuery.name}</p>
            <p><strong>Email:</strong> {selectedQuery.email}</p>
            <p><strong>Subject:</strong> {selectedQuery.subject}</p>

            <div>
              <strong>Message:</strong>
              <p className="mt-1 text-gray-700">{selectedQuery.message}</p>
            </div>

            <button
              onClick={() => setOpenModal(false)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactQueries;
