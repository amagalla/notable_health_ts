declare module '../db/mysql.config' {
    import { Pool } from 'mysql2/promise';
  
    const pool: Pool;
  
    export default pool;
  }
  