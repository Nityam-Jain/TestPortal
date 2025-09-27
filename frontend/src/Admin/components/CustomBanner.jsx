import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";

export default function AdminBanner() {
  const [banners, setBanners] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);

  // Fetch banners  
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/admin/banners");
        setBanners(res.data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Upload banner
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");
    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("/api/admin/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowUpload(false);
      setFile(null);

      // refresh banners
      const res = await axios.get("/api/admin/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await axios.delete(`/api/admin/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Banner Manager
        </h2>
        <button
          className="px-4 py-2 border border-slate-500 text-slate-600 rounded-lg hover:bg-white-700 flex items-center gap-2"
          onClick={() => setShowUpload(true)}
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`/uploads/${banner.image}`}
              alt="Banner"
              className="w-full h-40 object-cover"
            />
            <button
              onClick={() => handleDelete(banner._id)}
              className="absolute top-2 right-2 bg-red-100/80 text-white p-1 p-2 rounded"
            >
              <Trash2 size={16} className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <h3 className="text-xl font-semibold mb-4">Add Banner</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="block w-full border border-gray-300 rounded-lg p-2"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Upload
              </button>
            </form>
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
