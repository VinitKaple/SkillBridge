import { useEffect, useState } from "react";
import { X, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, verifying, success

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Payment expired. Please try again.");
          onClose(); // Auto-close on expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(300);
      setPaymentStatus("pending");
    }
  }, [isOpen]);

  // Simulate payment verification
  const handleVerifyPayment = () => {
    setPaymentStatus("verifying");
    // Fake API call
    setTimeout(() => {
      setPaymentStatus("success");
      toast.success("Payment successful! Your plan has been upgraded.");
      if (onSuccess) onSuccess();
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Complete Payment</h3>
              <p className="text-xs text-gray-500">Scan QR code to pay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Timer */}
          <div className="mb-4 flex items-center justify-between rounded-lg bg-amber-50 p-3">
            <span className="text-sm font-medium text-amber-800">Time remaining</span>
            <span className={`font-mono text-xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-amber-700"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* QR Code from public folder */}
          <div className="mb-4 flex flex-col items-center justify-center">
            <img
              src="/qr.jpeg"
              alt="Payment QR Code"
              className="h-48 w-48 rounded-xl border-2 border-gray-200 object-cover"
            />
            <p className="mt-2 text-xs text-gray-500">Scan with any UPI app</p>
          </div>

          {/* Payment details */}
          <div className="mb-4 space-y-2 rounded-lg bg-gray-50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-gray-900">₹2,099 / year</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Plan</span>
              <span className="font-semibold text-blue-600">Advanced (Annual)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order ID</span>
              <span className="font-mono text-xs text-gray-500">ORD{Math.floor(Math.random() * 1000000)}</span>
            </div>
          </div>

          {/* Status message */}
          {paymentStatus === "verifying" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-blue-700">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm">Verifying payment...</span>
            </div>
          )}
          {paymentStatus === "success" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Payment successful! Redirecting...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyPayment}
              disabled={paymentStatus !== "pending"}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              Verify Payment
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            For demo only – click "Verify Payment" to simulate success
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;