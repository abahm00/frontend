import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-8 md:p-12 rounded-lg shadow-lg text-center"
        role="alert"
        aria-labelledby="error-title"
        aria-describedby="error-description"
      >
        <h1
          id="error-title"
          className="text-6xl font-extrabold text-red-600"
          role="heading"
          aria-level="1"
        >
          404
        </h1>

        <h2
          id="error-description"
          className="text-2xl font-semibold mt-4 text-gray-800"
          role="heading"
          aria-level="2"
        >
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-700">
          The page you're looking for doesn't exist or may have been removed.
        </p>

        <button
          onClick={handleGoHome}
          className="mt-6 text-white bg-red-500 hover:bg-red-600 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200"
          aria-label="Go back to the homepage"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
