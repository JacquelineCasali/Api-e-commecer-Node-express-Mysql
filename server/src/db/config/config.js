// require('dotenv').config()
// module.exports={
// "development": {
// "username": process.env.DATABASE_USER,
// "password": process.env.DATABASE_PASSWORD,
// "database": process.env.DATABASE_NAME,
// "host": process.env.DATABASE_HOST,
// "dialect": 'mysql',
// },
// }

const mysql=require('mysql2')
require('dotenv').config()
var pool=mysql.createPool({
"user": process.env.DATABASE_USER,
"password": process.env.DATABASE_PASSWORD,
"database": process.env.DATABASE_NAME,
"host": process.env.DATABASE_HOST,
"port": 3306

})
exports.pool=pool
