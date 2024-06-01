const express = require("express");
const usuariosControllers = require("../controllers/usuariosControllers");
const loginController = require("../controllers/loginController");
const dowloadController = require("../controllers/dowloadController");
const router = express.Router();

router.get('/do',dowloadController.dowload)


 router.post('/',usuariosControllers.criar)
router.get('/',usuariosControllers.listar)
    
 router.get("/:id", usuariosControllers.ler);
  router.put('/:id',usuariosControllers.update)
  router.delete("/:id",usuariosControllers.delete);

  router.post('/login',loginController.login)

module.exports = router;