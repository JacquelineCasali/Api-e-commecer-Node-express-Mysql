const mysql = require("../db/config/config").pool;


const path = require('path')




const dowloadController = {
  //cadastrar
   dowload: async (req, res) => {
  
       res.download(path.join(__dirname,'../../uploads/1fbd4cb61d-2024-04-26_125551.png'))

},
   

   


};
module.exports = dowloadController;
