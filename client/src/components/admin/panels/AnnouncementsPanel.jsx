import { useState } from "react";
import { Megaphone, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const AnnouncementsPanel = () => {

  const [list,setList] = useState([
    {
      id:1,
      title:"Infosys Registration Open",
      body:"Register before March 25"
    }
  ]);

  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");

  const addAnnouncement = ()=>{

    if(!title) return;

    setList([
      ...list,
      {id:Date.now(),title,body}
    ]);

    setTitle("");
    setBody("");

    toast.success("Announcement posted");

  };

  const remove = id=>{
    setList(list.filter(a=>a.id!==id));
    toast.success("Announcement removed");
  };

  return (

    <div className="bg-white border rounded-2xl p-6 space-y-5">

      <div className="flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-blue-600"/>
        <h3 className="font-semibold">Announcements</h3>
      </div>

      {/* Add Form */}

      <div className="space-y-2">

        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border px-3 py-2 rounded-lg text-sm"
        />

        <textarea
          value={body}
          onChange={e=>setBody(e.target.value)}
          placeholder="Message"
          className="w-full border px-3 py-2 rounded-lg text-sm"
        />

        <button
          onClick={addAnnouncement}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          <Plus className="w-4 h-4"/>
          Publish
        </button>

      </div>

      {/* List */}

      <div className="space-y-3">

        {list.map(a=>(
          <div
            key={a.id}
            className="flex justify-between items-start bg-gray-50 p-3 rounded-xl"
          >

            <div>
              <p className="font-semibold text-sm">{a.title}</p>
              <p className="text-xs text-gray-500">{a.body}</p>
            </div>

            <button
              onClick={()=>remove(a.id)}
              className="p-2 hover:bg-red-100 rounded-lg"
            >
              <Trash2 className="w-4 h-4 text-red-500"/>
            </button>

          </div>
        ))}

      </div>

    </div>

  );
};

export default AnnouncementsPanel;