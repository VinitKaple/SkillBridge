import { Send, Download, FileText, MoreHorizontal } from "lucide-react";

const RightPanel = () => {
  return (
   <div className="w-80 h-full bg-white border-l p-6 flex flex-col gap-8 overflow-y-auto">

      
      {/* Wallet Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-700">Premium</h2>
          <MoreHorizontal size={18} className="text-gray-400 cursor-pointer" />
        </div>

        {/* Card Image */}
        <img
          src="/card.png"   // 👈 your PNG name
          alt="Bank Card"
          className="rounded-xl shadow-md mb-4"
        />

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-600 transition">
            <Send size={20} />
            <span className="text-xs">Send report</span>
          </div>

          <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-600 transition">
            <Download size={20} />
            <span className="text-xs">Download report</span>
          </div>

          <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-600 transition">
            <FileText size={20} />
            <span className="text-xs">Print report</span>
          </div>

          <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-600 transition">
            <MoreHorizontal size={20} />
            <span className="text-xs">More</span>
          </div>
        </div>
      </div>

      {/* Customer Rating Section */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        
        {/* Rating Circle */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-orange-400 text-white text-xl font-bold">
            4.5
          </div>

          <div className="flex text-yellow-400 mt-2">
            ⭐⭐⭐⭐⭐
          </div>
        </div>

        {/* Feedback Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">
            Customer Feedback
          </h3>
          <span className="text-xs text-blue-600 cursor-pointer">
            See All
          </span>
        </div>

        {/* Feedback List */}
        <div className="flex flex-col gap-4 text-sm">
          
          <div className="flex items-start gap-3">
            <img
              src="/male1.png"
              alt="user"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium">Robert Smith</p>
              <p className="text-gray-500 text-xs">
                Excellent AI recommendations!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img
              src="/female1.jpg"
              alt="user"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium">Deni Lovar</p>
              <p className="text-gray-500 text-xs">
                Smooth cross-sell experience.
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default RightPanel;
