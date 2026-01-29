import { decrement_views, delete_paste_by_id, get_paste_by_id } from "@/lib/helper";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const test_on = process.env.TEST_MODE;
  const { id: urlId } = await params; 

  try {
    // if the paste doesnt exist
    const res = await get_paste_by_id(urlId);
    if (!res || res.length === 0) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }
    let { Created, Expiry, Content, ViewsLeft } = res[0];
    const header = req.headers.get('x-test-now-ms');
    const nowMs = (test_on && header) ? Number(header) : Date.now();
    const now = new Date(nowMs);
    console.log("now = ",now)
    console.log("expiry = ", new Date(Expiry));
    console.log(now>new Date(Expiry))
    if(ViewsLeft ==0 || (Expiry && now> new Date(Expiry))){
      await delete_paste_by_id(urlId);
      return NextResponse.json({
        error:"Paste doesnt exist"
      }, {status:404})
    }else{
      if(ViewsLeft!=null){
        if(ViewsLeft>0){
          try{
            const views_left_updated = (await decrement_views(urlId))['ViewsLeft'];
            ViewsLeft = views_left_updated;
          }catch(err){
            return NextResponse.json({
              error:"Failed to decrement viewsLeft"
            },{status:500})
          }
        }
      }
    }
    return NextResponse.json({
      Content: Content,
      remaining_views: ViewsLeft,
      expires_at: Expiry
    });

  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}