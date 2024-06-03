const express = require("express");
const categoriesControllers = require("../controllers/categoriesControllers");

const login = require("../middleware/login");






// const upload=multer({ storage:storage})
const router = express.Router();

//login.obrigatorio rota privada
 router.post('/',login.obrigatorio,categoriesControllers.criar)
 router.get('/',categoriesControllers.listar)
router.get("/:categoryId", categoriesControllers.ler);
 router.put("/:categoryId",login.obrigatorio,categoriesControllers.update)
 router.delete("/:categoryId",login.obrigatorio,categoriesControllers.delete);




module.exports = router;