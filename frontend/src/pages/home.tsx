import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-gray-400 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-700">Welcome to the Claims Upload System!</h1>
        <p>Upload your claims by clicking the button below:</p>
        <Link to="/upload">
          <button className="bg-blue-500 text-white px-4 py-2 mt-8 rounded-md shadow hover:bg-blue-600 transition duration-200">
            Go to File Upload
          </button>
        </Link>
      </div>
    </div>
  );
}
