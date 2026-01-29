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
    const { Created, Expiry, Content, ViewsLeft } = res[0];
    console.log(res[0])
    const header = req.headers.get('x-test-now-ms');
    const nowMs = (test_on && header) ? Number(header) : Date.now();
    const now = new Date(nowMs);
    console.log("now = ",now)
    console.log("expiry = ", new Date(Expiry));
    console.log(now>new Date(Expiry))
    if (Expiry && now > new Date(Expiry)) {
      // expiry not null and now>expiry
        try{
          // if expired then delete
            await delete_paste_by_id(urlId);
        }catch(err){
            NextResponse.json({error:"Paste May not exist"}, {status:404});
        }
    }else{
      // (expiry == null) or now<=expiry
      if(Expiry==null){
        // worry about ViewsLeft
        if(ViewsLeft==0){
          return NextResponse.json({ error: "Paste has expired" }, { status: 404 });
        }else{
          // dec viewsLeft by 1
          try{
            const updated_paste_views_left = (await decrement_views(urlId))['ViewsLeft'];
            return NextResponse.json({
              Content:Content,
              remaining_views:updated_paste_views_left,
              expires_at:null              
            });
          }catch(err){
            return NextResponse.json({error:"Error Decrementing views"}, {
              status:500
            });
          }
        }
      }else{
        // we have expiry time
        
      }
    }

    return NextResponse.json({
      content: Content,
      created: Created,
      viewsLeft: ViewsLeft
    });

  } catch (err: any) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}