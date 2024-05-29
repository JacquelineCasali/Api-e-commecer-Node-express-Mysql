const express = require("express");
const pedidosControllers = require("../controllers/pedidosControllers");
const router = express.Router();


 router.post('/',pedidosControllers.criar)
router.get('/',pedidosControllers.listar)
    
 router.get("/:id", pedidosControllers.ler);
  router.put('/:id',pedidosControllers.update)
  router.delete("/:id",pedidosControllers.delete);

module.exports = router;