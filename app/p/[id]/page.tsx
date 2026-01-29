import CopyBtn from "@/app/components/CopyBtn";
import { delete_paste_by_id, get_paste_by_id } from "@/lib/helper";
import { notFound } from "next/navigation";
import { validate as validateUuid } from "uuid"; // You already have this installed!
interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function PastePage({ params }: PageProps) {
  const { id } = await params;
  if (!validateUuid(id)) {
    console.error("Invalid UUID format attempted:", id);
    return notFound(); 
  }

  try {
    const res = await get_paste_by_id(id);
    if (!res || res.length === 0) {
      return notFound();
    }
    const {Expiry } = res[0];
    if(Expiry!=null){
      const nowms = Date.now();
      const now = new Date(nowms);
      if(now > new Date(Expiry)){
        await delete_paste_by_id(id);
        return notFound();
      }
    }
  
    const paste = res[0];

    return (
      <>
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-8">
        <div className="max-w-2xl w-full border rounded-xl p-6 bg-white shadow-md">
            <h1 className="text-blue-600">Content:</h1>
            <pre className="whitespace-pre-wrap break-words p-4 rounded text-sm leading-relaxed text-black">
                {paste.Content}
            </pre>
        <CopyBtn id ={id}/>
        </div>
    </main>
    </>


    );
  } catch (error) {
    // This catches actual DB connection errors, not just "not found"
    console.error("Database error:", error);
    return notFound();
  }
}