import { neon } from '@neondatabase/serverless';

// This uses the pooled URL you shared in your .env
const sql = neon(`${process.env.DATABASE_URL}`);

export default sql;