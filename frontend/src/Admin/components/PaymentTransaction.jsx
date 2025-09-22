import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/transactions"); // adjust API route as per backend
      setTransactions(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      Swal.fire("Deleted", "Transaction deleted successfully", "success");
    } catch (err) {
      console.error("Delete error:", err);
      Swal.fire("Error", "Failed to delete transaction", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      {loading ? (
        <p className="text-gray-500">Loading transactions...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  Sr.
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Transaction ID
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  Service/Test
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 ">
                  Amount
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">
                  Date
                </th>
                <th className="text-center px-4 py-3 font-medium text-gray-700 ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((txn, i) => (
                <tr key={txn._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-3 py-2 text-sm md:text-base">{i + 1}</td>
                  <td className="px-3 py-2 text-sm md:text-base">{txn.transactionId}</td>
                  <td className="px-3 py-2 text-sm md:text-base">
                    {txn.userName} ({txn.userEmail})
                  </td>
                  <td className="px-3 py-2 text-sm md:text-base">{txn.serviceName}</td>
                  <td className="px-3 py-2 text-sm md:text-base">₹{txn.amount}</td>
                  <td className="px-3 py-2 text-sm md:text-base">{txn.status}</td>
                  <td className="px-3 py-2 text-sm md:text-base">
                    {new Date(txn.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => handleDelete(txn._id)}
                      className="p-2 hover:bg-red-100/80 rounded"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transactions;
