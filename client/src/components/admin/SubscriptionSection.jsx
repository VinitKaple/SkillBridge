import { useState } from "react";
import { CheckCircle, Zap, Shield, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import PaymentModal from "../../components/PaymentPopup"; // adjust path as needed

const SubscriptionSection = () => {
  const [billing, setBilling] = useState("monthly");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const standardPrice = billing === "annual" ? "₹699" : "₹999";
  const advancedPrice = billing === "annual" ? "₹2,099" : "₹2,999";

  const handleUpgradeClick = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("Welcome to Advanced plan!");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header with toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Subscription Plans</h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium transition-colors ${
                billing === "monthly" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => {
                setBilling(b => (b === "monthly" ? "annual" : "monthly"));
                toast.success(`Switched to ${billing === "monthly" ? "annual" : "monthly"} billing`);
              }}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                billing === "annual" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  billing === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-xs font-medium transition-colors ${
                billing === "annual" ? "text-gray-900" : "text-gray-400"
              }`}
            >
              Annual
              <span className="ml-1 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-600">
                Save 30%
              </span>
            </span>
          </div>
        </div>

        {/* Current plan banner */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-3">
          <Shield className="h-5 w-5 text-amber-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">You are on the Standard Plan</p>
            <p className="text-xs text-amber-600">
              Upgrade to Advanced for AI features & unlimited access
            </p>
          </div>
          <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-800 shrink-0">
            Current
          </span>
        </div>

        {/* Two plan cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Standard */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              Current Plan
            </span>
            <h3 className="mt-3 text-xl font-bold text-gray-900">Standard</h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">{standardPrice}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">For small colleges</p>

            <div className="mt-4 space-y-3">
              {[
                "Resume Analysis",
                "Resume Builder",
                "Mock Preparation",
                "Up to 20 companies",
                "500 student profiles",
                "Basic placement analytics",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              disabled
              className="mt-6 w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed"
            >
              Active Plan
            </button>
          </div>

          {/* Advanced */}
          <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-5 shadow-lg">
            {/* Most Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-md">
                <Zap className="h-3 w-3 text-yellow-300" />
                Most Popular
              </span>
            </div>

            <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Recommended
            </span>
            <h3 className="mt-3 text-xl font-bold text-gray-900">Advanced</h3>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-blue-600">{advancedPrice}</span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">For colleges serious about placements</p>

            <div className="mt-4 space-y-3">
              {[
                "Unlimited companies",
                "Unlimited students",
                "AI skill matching",
                "Custom analytics dashboard",
                "Mock interview insights",
                "Placement prediction",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 shrink-0 text-blue-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleUpgradeClick}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Upgrade Now <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Optional note */}
        <p className="text-center text-xs text-gray-400">
          All plans include free updates and support. Cancel anytime.
        </p>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default SubscriptionSection;