import React from "react";

export default function ReadDocs() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-100 to-white px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full border">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Documentation</h2>
        <p className="text-gray-700 mb-4">
          Welcome to the CodeHub documentation! This platform was created by Masudul Alam, a full-stack web developer passionate about building efficient and scalable web applications.
        </p>

        <h3 className="text-xl font-semibold mb-2">Getting Started</h3>
        <p className="text-gray-700 mb-4">
          To start using CodeHub, you can create an account, post your code snippets, and explore code posted by other developers. This documentation will guide you through the features step-by-step.
        </p>

        <h3 className="text-xl font-semibold mb-2">Features</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Post and share code snippets</li>
          <li>User authentication with roles (student/admin)</li>
          <li>Profile management</li>
          <li>Real-time updates and notifications (coming soon!)</li>
        </ul>

        <p className="mt-6 text-gray-600 italic">
          Developed with ❤️ by Masudul Alam
        </p>
      </div>
    </div>
  );
}
