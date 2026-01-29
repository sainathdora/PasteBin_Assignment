import { NextRequest, NextResponse } from "next/server";
import { add_new_paste } from "@/lib/helper";
import {v4 as uuidv4} from 'uuid'
import sql from "@/lib/db";
import { url } from "inspector";
export async function POST(req: NextRequest) {
  const base_url = new URL(req.url).origin
  let {content, ttl_seconds, max_views } = await req.json();
  if(!max_views){
    max_views=null;
  }
  if(!ttl_seconds){
    ttl_seconds=null;
  }
  const test_on = process.env.TEST_MODE
  if(!(content )){
      return NextResponse.json(
        {Error:"Invalid Input" },
        { status: 400 }
      );
  }else{
    if(ttl_seconds || max_views){
        // generate a unique id, uuid
        const newID = uuidv4();
        let expiry = null;
        let views_left = Number(max_views);
        let nowMs:number;
        if(test_on){
          const header = req.headers.get('x-test-now-ms');
          nowMs = header ? Number(header): Date.now();
          const now = new Date(nowMs);
        }else{
          nowMs = Date.now();
        }
        const now = new Date(nowMs);
        if(ttl_seconds!=null){
          expiry = new Date(nowMs + ttl_seconds*1000);
        }
        try{
          const res = await add_new_paste(newID, now, expiry, content, views_left);
          console.log(res[0]['id'])
          return NextResponse.json({
            id:res[0]['id'],
            url:`${base_url}/p/${res[0]['id']}`
          }, {status:200});

        }catch(err){
          return NextResponse.json({Error:"Internal Server Error"}, {status:500})
        }
    }else{
         return NextResponse.json(
        {Error:"Invalid Input" },
        { status: 400 } 
      );   
    }
  }
}
