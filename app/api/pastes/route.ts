import { NextRequest, NextResponse } from "next/server";
import { add_new_paste } from "@/lib/helper";
import {v4 as uuidv4} from 'uuid'
import sql from "@/lib/db";
export async function POST(req: NextRequest) {
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
        let views_left = max_views;
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
          const result = await sql`
          INSERT INTO posts (id, "Created", "Expiry", "Content", "ViewsLeft") VALUES (${newID}, ${now}, ${expiry}, ${content}, ${views_left});
          `;
          console.log(result[0]);
        }catch(err){
          console.log(err)
        }
    }else{
         return NextResponse.json(
        {Error:"Invalid Input" },
        { status: 400 }
      );   
    }
  }
}
