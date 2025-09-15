"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Upload, Plus } from "lucide-react";

export default function ReelsManager() {
  const [reels, setReels] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fetch all reels
  const fetchReels = async () => {
    try {
      const res = await axios.get("/api/reels/getReels");
      setReels(res.data);
    } catch (err) {
      console.error("Error fetching reels:", err);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  // Upload reel
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile)
      return Swal.fire("Oops!", "Please select an MP4 file", "warning");

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      setLoading(true);
      await axios.post("/api/reels/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideoFile(null);
      setShowModal(false);
      fetchReels();

      Swal.fire("✅ Success", "Reel uploaded successfully!", "success");
    } catch (err) {
      console.error("Error uploading reel:", err);
      Swal.fire("❌ Error", "Failed to upload reel", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete reel
  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This reel will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      await axios.delete(`/api/reels/${id}`);
      fetchReels();
      Swal.fire("Deleted!", "The reel has been deleted.", "success");
    } catch (err) {
      console.error("Error deleting reel:", err);
      Swal.fire("Error", "Failed to delete reel", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Reels Manager</h1>

      {/* ➕ Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-6"
      >
        <Plus size={18} /> Add Reel
      </button>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Upload New Reel</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.size > 3.5 * 1024 * 1024) {
                    Swal.fire(
                      "❌ File Too Large",
                      "File size must be less than 3.5 MB",
                      "error"
                    );
                    e.target.value = ""; // reset input
                    return;
                  }
                  setVideoFile(file);
                }}
                className="w-full border p-2 rounded-lg"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <Upload size={18} />
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reel List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reels.length === 0 ? (
          <p className="text-gray-500">No reels uploaded yet.</p>
        ) : (
          reels.map((reel) => (
            <div
              key={reel._id}
              className="relative bg-white shadow-md rounded-xl overflow-hidden"
            >
              <video
                src={`http://localhost:5000${reel.videoUrl}`}
                controls
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => handleDelete(reel._id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
