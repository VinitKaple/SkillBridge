import SubscriptionSection from "./SubscriptionSection";
import TNPControlPanel from "./TNPControlPanel";
import { Activity } from "lucide-react";
import { Toaster } from "sonner";

const AdminPage = () => {
  return (
    <div className="flex flex-col pb-12 space-y-8">

      <Toaster position="top-right" richColors />

      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
          <Activity className="w-4 h-4 text-green-600"/>
          <span className="text-xs font-semibold text-green-700">
            Placement Season Active
          </span>
        </div>
      </div>

      <SubscriptionSection />

      <div className="border-t border-gray-200"/>

      <TNPControlPanel />

    </div>
  );
};

export default AdminPage;