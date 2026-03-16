import { useState } from "react";
import { Building2, GraduationCap, Megaphone, TrendingUp } from "lucide-react";

import CollegeProfile from "./panels/CollegeProfile";
import CompaniesPanel from "./panels/CompaniesPanel";
import PlacementPanel from "./panels/PlacementPanel";
import AnnouncementsPanel from "./panels/AnnouncementsPanel";

const TNPControlPanel = () => {

  const [panel,setPanel] = useState("college");

  const PANELS = [
    {id:"college",label:"College",icon:GraduationCap},
    {id:"companies",label:"Companies",icon:Building2},
    {id:"placement",label:"Placements",icon:TrendingUp},
    {id:"ann",label:"Announcements",icon:Megaphone}
  ];

  return (
    <div className="space-y-5">

      <div className="flex gap-2 flex-wrap">

        {PANELS.map(p=>{

          const Icon = p.icon;

          return(
            <button
              key={p.id}
              onClick={()=>setPanel(p.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl
              ${panel===p.id
                ?"bg-blue-600 text-white"
                :"bg-white border border-gray-200 text-gray-600"}
              `}
            >
              <Icon className="w-4 h-4"/>
              {p.label}
            </button>
          )

        })}

      </div>

      {panel==="college" && <CollegeProfile/>}
      {panel==="companies" && <CompaniesPanel/>}
      {panel==="placement" && <PlacementPanel/>}
      {panel==="ann" && <AnnouncementsPanel/>}

    </div>
  );
};

export default TNPControlPanel;