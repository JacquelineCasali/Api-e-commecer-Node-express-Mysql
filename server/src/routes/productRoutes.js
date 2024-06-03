const express = require("express");
const productControllers = require("../controllers/productControllers");
const uploadImge=require('../middleware/uploadImage');
const login = require("../middleware/login");






// const upload=multer({ storage:storage})
const router = express.Router();

//login.obrigatorio rota privada
 router.post('/',login.obrigatorio,uploadImge.single('image'),productControllers.criar)
 router.get('/',productControllers.listar)
router.get("/:productId", productControllers.ler);
 router.put("/:productId",login.obrigatorio,uploadImge.single('image'),productControllers.update)
 router.delete("/:productId",login.obrigatorio,productControllers.delete);




module.exports = router;