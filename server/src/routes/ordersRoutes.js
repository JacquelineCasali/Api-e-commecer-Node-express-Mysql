const express = require("express");
const ordersControllers = require("../controllers/ordersControllers");
const router = express.Router();


 router.post('/',ordersControllers.criar)
router.get('/',ordersControllers.listar)
    
 router.get("/:orderId", ordersControllers.ler);
  router.put('/:orderId',ordersControllers.update)
  router.delete("/:orderId",ordersControllers.delete);

 
module.exports = router;