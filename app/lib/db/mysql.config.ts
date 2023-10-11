import mysql, { Pool } from "mysql2/promise";
import env from "dotenv";

env.config();

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.getConnection()
  .then(() => {
    console.log("Mysql connected...");
  })
  .catch((err) => {
    throw err;
  });

export default pool;
