import React from "react";
import { Trash2 } from "lucide-react";

const ContactQueries = () => {
  const queries = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@example.com",
      subject: "Job Inquiry",
      message: "I would like to know more about the React Developer position.",
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya@example.com",
      subject: "Partnership",
      message: "Interested in collaborating on upcoming projects.",
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Contact Queries</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Message</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr
                key={query.id}
                className="bg-white shadow-sm rounded-lg"
              >
                <td className="p-3 font-medium">{query.name}</td>
                <td className="p-3 text-gray-600">{query.email}</td>
                <td className="p-3">{query.subject}</td>
                <td className="p-3">{query.message}</td>
                <td className="p-3">
                  <button className="flex items-center gap-1p-3 hover:bg-red-100/80 rounded">
                    <Trash2 size={16} className="w-5 h-5 text-red-600"/> 
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactQueries;
