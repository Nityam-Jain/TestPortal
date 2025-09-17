import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import
import Swal from "sweetalert2";

export default function UserTests({ vendorId }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();

const handleTakeTest = (testId, testTitle) => {
  // Show SweetAlert instructions
  Swal.fire({
    title: `Instructions for ${testTitle}`,
    html: `
      <p>Please read the instructions carefully before starting the test:</p>
      <ul style="text-align:left;">
        <li>All questions are mandatory.</li>
        <li>Once started, the timer cannot be paused.</li>
        <li>Do not refresh the page during the test.</li>
      </ul>
    `,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "Start Test",
  }).then((result) => {
    if (result.isConfirmed) {
      // Navigate to new test page
      navigate(`/take-test/${testId}`);
    }
  });
};
  const token = sessionStorage.getItem("userToken"); // JWT token

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await axios.get("/api/tests/getAllTests", {
          headers: { Authorization: `Bearer ${token}` },
            params: { vendorId },  // send vendorId if needed

        });
        setTests(res.data);
       } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [token, vendorId]);

  if (loading) return <p className="p-6 text-center">Loading tests...</p>;
  if (!tests.length)
    return <p className="p-6 text-center">No tests available.</p>;

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {tests.map((test) => (
        <div
          key={test._id}
          className="border border-blue-300 rounded-lg bg-white shadow-md p-4 hover:shadow-lg transition duration-200"
         >
          <h3 className="text-xl font-semibold mb-2">{test.title}</h3>
          <p className="text-gray-600 mb-2">{test.description || "No description"}</p>

          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Duration:</span> {test.duration} min
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Difficulty:</span> {test.difficulty}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Total Marks:</span> {test.totalMarks}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Created By:</span> {test.vendorId?.username || "Unknown"}
          </p>

        <button
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  onClick={() => handleTakeTest(test._id, test.title)}
>
  Start Test
</button>
        </div>
      ))}
    </div>
  );
}
