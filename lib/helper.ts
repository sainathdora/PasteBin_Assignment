import { NextResponse } from "next/server";
import sql from "./db";

export async function add_new_paste(newID:string, now:Date, expiry:Date|null, content:string , views_left:number) {
     try{
         const result = await sql`INSERT INTO posts (id, "Created", "Expiry", "Content", "ViewsLeft")
         VALUES (${newID}, ${now}, ${expiry}, ${content}, ${views_left}) RETURNING *;
`;
          return result;
        }catch(err){
          throw err;
        }
}
export async function get_paste_by_id(id: string) {
  try {
    const res = await sql`
      SELECT * FROM posts WHERE id = ${id};`;
    //   console.log("result = ",res)   
    return res;
  } catch (err) {
    throw err;
  }
}

export async function delete_paste_by_id(id: string) {
  try {
    const res = await sql`
      DELETE FROM posts WHERE id = ${id}
    `;
    console.log("Delete successful for ID:", id);
    return res; 
  } catch (err) {
    console.error("Database deletion error:", err);
    throw err;
  }
}
export async function decrement_views(id: string) {
  try {
    // Only subtract 1 if "ViewsLeft" is NOT NULL
    const res = await sql`
      UPDATE posts 
      SET "ViewsLeft" = "ViewsLeft" - 1 
      WHERE id = ${id} AND "ViewsLeft" IS NOT NULL
      RETURNING "ViewsLeft";
    `;
    return res[0];
  } catch (err) {
    console.error("Error decrementing views:", err);
    throw err;
  }
}