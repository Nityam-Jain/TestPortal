import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminBanner() {
  const [banners, setBanners] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

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

    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "No File Selected",
        text: "Please select an image before uploading."
      });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post("/api/admin/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Banner uploaded successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowUpload(false);
      setFile(null);
      setPreview(null);

      // refresh banners
      const res = await axios.get("/api/admin/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Something went wrong while uploading banner.",
      });
    }
  };

  // Delete banner with SweetAlert
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`/api/admin/banners/${id}`);
      setBanners((prev) => prev.filter((b) => b._id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "Banner deleted successfully.",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire({
        title: "Error",
        text: "Failed to delete banner.",
        icon: "error",
      });
    }
  };

  // Handle file + preview
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
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
                onChange={handleFileSelect}
                className="block w-full border border-gray-300 rounded-lg p-2"
              />

              {/* Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-30 object-cover rounded-lg border"
                />
              )}

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Upload
              </button>
            </form>

            <button
              onClick={() => { setShowUpload(false); setPreview(null); setFile(null); }}
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
