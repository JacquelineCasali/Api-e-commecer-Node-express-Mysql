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
    //limite de conecções 
"connectionLimit":1000,
"user": process.env.DATABASE_USER,
"password": process.env.DATABASE_PASSWORD,
"database": process.env.DATABASE_NAME,
"host": process.env.DATABASE_HOST,
"port": 3306

})

// conexao generica 
//resolve deu certo 
//reject deu erro
exports.execute=(query,params=[])=>{
    return new Promise((resolve,reject)=>{
        pool.query(query,params,(error,resultado,fields)=>{
                    if(error){
                        reject(error)
                    }else{
                        resolve(resultado)
                    }
                });
            })
        
    }




exports.pool=pool
