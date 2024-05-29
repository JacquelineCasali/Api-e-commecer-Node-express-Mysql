const express = require("express");
const produtosControllers = require("../controllers/produtosControllers");
const uploadImge=require('../middleware/uploadImage');
const login = require("../middleware/login");






// const upload=multer({ storage:storage})
const router = express.Router();

//login.obrigatorio rota privada
 router.post('/',login.obrigatorio,uploadImge.single('image'),produtosControllers.criar)


 router.get('/',produtosControllers.listar)
    
router.get("/:id", produtosControllers.ler);
 router.put('/:id',login.obrigatorio,uploadImge.single('image'),produtosControllers.update)
 router.delete("/:id",login.obrigatorio,produtosControllers.delete);

module.exports = router;