import {
  Calendar,
  Briefcase,
  GraduationCap,
  Megaphone,
  Clock,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useEffect, useRef } from "react";

const RightPanel = () => {

  const notices = [
    {
      id: 1,
      type: "placement",
      title: "Infosys Campus Placement Drive",
      description: "Registration closes on March 25, 2026. Eligible branches: CSE, IT, ECE.",
      date: "2026-03-20",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "#",
      new: true,
      priority: true
    },
    {
      id: 2,
      type: "workshop",
      title: "Resume Building Workshop",
      description: "Industry mentors will guide students on creating ATS-friendly resumes.",
      date: "2026-03-22",
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "#",
      new: true
    },
    {
      id: 3,
      type: "internship",
      title: "Google Summer Internship 2026",
      description: "Applications open for pre-final year students. Deadline: April 5.",
      date: "2026-03-18",
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-50",
      link: "#"
    },
    {
      id: 4,
      type: "announcement",
      title: "Mock Interviews by TCS Alumni",
      description: "Sign-up for mock interviews on March 28–29. Limited seats available.",
      date: "2026-03-19",
      icon: Megaphone,
      color: "text-orange-600",
      bg: "bg-orange-50",
      link: "#"
    },
    {
      id: 5,
      type: "deadline",
      title: "Microsoft Online Assessment",
      description: "Technical screening test scheduled on March 30.",
      date: "2026-03-21",
      icon: Clock,
      color: "text-red-600",
      bg: "bg-red-50",
      link: "#",
      priority: true
    },
    {
      id: 6,
      type: "workshop",
      title: "Aptitude Training Session",
      description: "Weekend aptitude preparation program for placement season.",
      date: "2026-03-24",
      icon: GraduationCap,
      color: "text-purple-600",
      bg: "bg-purple-50",
      link: "#"
    },
    {
      id: 7,
      type: "placement",
      title: "Amazon Placement Drive",
      description: "Online assessment scheduled for April 2. Prepare well.",
      date: "2026-03-26",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: "#"
    },
  ];

  const scrollRef = useRef(null);

  // Auto scroll effect
  useEffect(() => {
 

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  return (
    <div className="w-80 h-full bg-white border-l p-6 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-800">
            TNP Announcements
          </h2>
        </div>

        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {notices.length}+ 
        </span>
      </div>

      {/* Notice List */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-4 overflow-y-auto pr-1"
      >
        {notices.map((notice) => {
          const Icon = notice.icon;

          return (
            <div
              key={notice.id}
              className={`p-4 rounded-xl border transition-all hover:shadow-sm cursor-pointer
              ${notice.priority ? "bg-blue-50 border-blue-200" : "border-gray-100"}`}
            >
              <div className="flex gap-3">

                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-lg ${notice.bg} flex items-center justify-center flex-shrink-0`}
                >
                  <Icon size={20} className={notice.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                  <div className="flex items-start justify-between gap-2">

                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">
                        {notice.title}
                      </h3>

                      {notice.new && (
                        <span className="text-[10px] px-2 py-0.5 bg-green-500 text-white rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(notice.date)}
                    </span>

                  </div>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {notice.description}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                    <span>View details</span>
                    <ExternalLink size={12} />
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-400 text-center pt-4 border-t mt-4">
        Training & Placement Cell • Career Updates
      </div>

    </div>
  );
};

export default RightPanel;