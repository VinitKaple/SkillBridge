import SubscriptionSection from "../components/admin/SubscriptionSection";
import TNPControlPanel from "../components/admin/TNPControlPanel";

import { Activity } from "lucide-react";
import { Toaster } from "sonner";

const AdminPage = () => {
  return (
    <div className="flex flex-col pb-12 space-y-4">

      <Toaster position="top-right" richColors />


      <SubscriptionSection />

      <div className="border-t border-gray-200"></div>

      <TNPControlPanel />

    </div>
  );
};

export default AdminPage;