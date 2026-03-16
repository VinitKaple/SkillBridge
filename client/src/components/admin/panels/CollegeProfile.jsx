import { useState } from "react";
import { GraduationCap, Save } from "lucide-react";
import { toast } from "sonner";

const CollegeProfile = () => {

  const [college,setCollege] = useState({
    name:"SVKM Institute of Technology",
    location:"Mumbai, Maharashtra",
    naac:"A+",
    affiliation:"Mumbai University",
    established:"2001",
    tpo:"Prof. Sharma",
    email:"tpo@svkm.edu.in",
    phone:"+91 98200 12345"
  });

  const input =
    "w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500";

  const handleSave = () => {
    toast.success("College profile updated");
  };

  return (

    <div className="bg-white border rounded-2xl p-6 space-y-5">

      <div className="flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-blue-600"/>
        <h3 className="font-semibold text-gray-800">
          College Profile
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          className={input}
          value={college.name}
          placeholder="College Name"
          onChange={e=>setCollege({...college,name:e.target.value})}
        />

        <input
          className={input}
          value={college.location}
          placeholder="Location"
          onChange={e=>setCollege({...college,location:e.target.value})}
        />

        <input
          className={input}
          value={college.naac}
          placeholder="NAAC Grade"
          onChange={e=>setCollege({...college,naac:e.target.value})}
        />

        <input
          className={input}
          value={college.affiliation}
          placeholder="University"
          onChange={e=>setCollege({...college,affiliation:e.target.value})}
        />

        <input
          className={input}
          value={college.established}
          placeholder="Established Year"
          onChange={e=>setCollege({...college,established:e.target.value})}
        />

        <input
          className={input}
          value={college.tpo}
          placeholder="TPO Name"
          onChange={e=>setCollege({...college,tpo:e.target.value})}
        />

        <input
          className={input}
          value={college.email}
          placeholder="TPO Email"
          onChange={e=>setCollege({...college,email:e.target.value})}
        />

        <input
          className={input}
          value={college.phone}
          placeholder="TPO Phone"
          onChange={e=>setCollege({...college,phone:e.target.value})}
        />

      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
      >
        <Save className="w-4 h-4"/>
        Save Profile
      </button>

    </div>

  );
};

export default CollegeProfile;