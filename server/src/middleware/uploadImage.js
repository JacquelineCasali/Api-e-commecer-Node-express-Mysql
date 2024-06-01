// Incluir as bibliotecas
// Upload de arquivos
const multer  = require('multer');
const crypto=require("crypto");
const {existsSync, mkdirSync} =require('fs') 
const path=require('path')
const diretorio=path.join(__dirname,'..','..','uploads')

// Realizar upload da imagem
module.exports = (multer({
  // onde vai ser salvo
// onde vai ser salvo
   // diskStorage permite manipular locar para salvar a imagem
    storage: multer.diskStorage({

        // Local para salvar a imagem
        destination: (req, file, cb) => {
            cb(null, './uploads/')
            if(!existsSync(diretorio)){
                mkdirSync(diretorio)
            }
        },

        // Nome que deve ser atribuido ao arquivo
        filename: (req, file, cb) => {
            crypto.randomBytes(5, (err, hash) => {
                file.image = `${hash.toString("hex")}-${file.originalname}`;
  
                cb(null, file.image);  
            })
          
                  }
    }),

  //limites de uploads
    limits: {
        //tamanho do arquivo
        fileSize: 2 * 1024 * 1024
      },

    // Validar a extensão do arquivo
    fileFilter: (req, file, cb) => {

        // Verificar se a extensão da imagem enviada pelo usuário está no array de extensões
        const extesaoImg = ['image/png', 'image/jpg', 'image/jpeg','image/gif'].find(formatoAceito => formatoAceito == file.mimetype);

        // Retornar TRUE quando a extensão da imagem é válida
        if(extesaoImg){
            return cb(null, true);
        }

        // Retornar FALSE quando a extensão da imagem é válida
        return cb(null, false);
    }
}))