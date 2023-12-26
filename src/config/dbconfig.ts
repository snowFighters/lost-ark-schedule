import mysql from 'mysql2/promise';

export const connection =  mysql.createPool({
  port: parseInt(process.env.DB_PORT as string),
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectTimeout: 5000,
  connectionLimit: 10,
  keepAliveInitialDelay: 10000,
  enableKeepAlive:true,
})
