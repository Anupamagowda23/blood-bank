import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-red-700 mb-4">
        🩸 Welcome to the Blood Bank Portal
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-xl">
        Be a hero today — donate blood, request help, or search for available donors. Together, we save lives.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/donate"
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow"
        >
          Donate Blood
        </Link>
        <Link
          to="/request"
          className="bg-white border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-100 transition shadow"
        >
          Request Blood
        </Link>
        <Link
          to="/search"
          className="bg-red-100 text-red-800 px-6 py-3 rounded-lg hover:bg-red-200 transition shadow"
        >
          Search Donors
        </Link>
      </div>
    </div>
  );
};

export default Home;
