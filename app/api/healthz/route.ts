import { NextResponse, NextRequest } from "next/server";
import sql from "@/lib/db";
export async function GET() {
    try{
        const res = await sql`SELECT NOW()`
        return NextResponse.json({
            ok: true,  
        }, {
            status:200
        });
    }catch(err){
        return NextResponse.json({
            ok:false
        },{
            status:500
        })
    }
}
