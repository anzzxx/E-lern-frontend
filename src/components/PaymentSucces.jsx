import { useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id");
  const courseId = searchParams.get("course_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-green-600">Payment Successful!</h1>
        <p className="text-gray-700 mt-2">
          Thank you for your purchase. Your transaction was successful.
        </p>
        <div className="mt-4 text-gray-600">
          <p><strong>Transaction ID:</strong> {transactionId}</p>
          <p><strong>Course ID:</strong> {courseId}</p>
        </div>
        <a
          href="/dashboard"
          className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
