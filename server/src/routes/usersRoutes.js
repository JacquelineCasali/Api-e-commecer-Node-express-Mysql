const express = require("express");
const usersControllers = require("../controllers/usersControllers");
const loginController = require("../controllers/loginController");
const dowloadController = require("../controllers/dowloadController");
const router = express.Router();

router.get('/do',dowloadController.dowload)


 router.post('/',usersControllers.criar)
router.get('/',usersControllers.listar)
    
 router.get("/:userId", usersControllers.ler);
  router.put('/:userId',usersControllers.update)
  router.delete("/:userId",usersControllers.delete);

  router.post('/login',loginController.login)

module.exports = router;