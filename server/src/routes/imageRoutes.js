const express = require("express");
const router = express.Router();
const imagensController = require("../controllers/imagensController");
const login = require("../middleware/login");
const uploadImage = require("../middleware/uploadImage");
const maxFotos = 3;
// router.post('/', uploadImage.array('image',maxFotos), (req, res) => {
//     const { nome, site } = req.body;
//     res.json({ nome, site });
// });

router.post('/:productId/image',login.obrigatorio,uploadImage.single('image'),imagensController.postImage)
router.get('/:productId/image',imagensController.listarimagem)
router.delete('/:productId/image/:imageId',login.obrigatorio,imagensController.delete)


module.exports = router;