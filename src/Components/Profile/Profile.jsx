import React, { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-white px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border">
        <div className="flex items-center gap-4 mb-6">
          <UserCircle className="w-16 h-16 text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="capitalize mt-1 text-sm font-medium text-blue-600">{user.role}</p>
          </div>
        </div>

        <div className="text-gray-700 space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
}
