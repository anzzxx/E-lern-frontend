import { useNavigate } from "react-router-dom";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-red-600">Payment Failed!</h1>
        <p className="text-gray-700 mt-2">
          Oops! Something went wrong with your transaction.
        </p>
        <p className="text-gray-600 mt-2">
          Please try again or contact support if the issue persists.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
