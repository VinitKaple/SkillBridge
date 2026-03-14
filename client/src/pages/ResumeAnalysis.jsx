import { useState } from "react";
import { Upload } from "lucide-react";

export default function ResumeAnalyzer() {

const [form,setForm]=useState({
cgpa:"",
backlogs:"",
branch:"",
gradYear:"",
targetRole:""
})

const [file,setFile]=useState(null)

const handleSubmit=async()=>{

const data=new FormData()

data.append("file",file)

Object.keys(form).forEach(k=>{
data.append(k,form[k])
})

await fetch("http://localhost:5000/api/analyze-resume",{
method:"POST",
body:data
})

}

return(

<div className="min-h-screen flex justify-center items-center bg-slate-900">

<div className="bg-slate-800 p-8 rounded-xl w-[500px]">

<h2 className="text-white text-xl mb-6">Resume Analyzer</h2>

<input
type="number"
placeholder="CGPA"
className="input"
onChange={(e)=>setForm({...form,cgpa:e.target.value})}
/>

<input
type="number"
placeholder="Backlogs"
className="input"
onChange={(e)=>setForm({...form,backlogs:e.target.value})}
/>

<select
className="input"
onChange={(e)=>setForm({...form,branch:e.target.value})}
>

<option>IT</option>
<option>CS</option>
<option>CSE</option>
<option>COMPS</option>
<option>IOT</option>
<option>ENTC</option>
<option>MECH</option>

</select>

<select
className="input"
onChange={(e)=>setForm({...form,gradYear:e.target.value})}
>

<option>2025</option>
<option>2026</option>
<option>2027</option>
<option>2028</option>
<option>2029</option>

</select>

<input
type="text"
placeholder="Target Role (optional)"
className="input"
onChange={(e)=>setForm({...form,targetRole:e.target.value})}
/>

<input
type="file"
accept="pdf"
onChange={(e)=>setFile(e.target.files[0])}
/>

<button
onClick={handleSubmit}
className="bg-purple-600 w-full py-2 rounded mt-4"
>

Analyze Resume

</button>

</div>

</div>

)

}