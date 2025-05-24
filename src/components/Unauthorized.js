import React from "react";

const Unauthorized = () => {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-2 text-gray-600">
        You do not have permission to access this page.
      </p>
    </div>
  );
};

export default Unauthorized;
