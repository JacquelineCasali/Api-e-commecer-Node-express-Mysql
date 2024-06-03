const mysql = require("../db/config/config");
const fs=require("fs")
const path=require("path");
const uploadConfig = require("../db/config/upload");
const imagensController = {


   //inserindo varia imagens 

postImage: async (req, res) => {
    // receber dados enviados no corpo
    try {
    const { productId } = req.params;
      console.log(req.file);
      console.log(req.user);
  
  const resultado = await mysql.execute(
          "INSERT INTO productimages(productId, path) VALUES (?,?)",
          [productId, req.file.filename]
        );
        const response = {
          messagem: "Imagem inserida com sucesso",
          createdImage: {
            
            
            productId:parseInt(productId),
            //produtoId:req.params.produtoId,
            imageId: resultado.insertId,
            image:process.env.URL_ADM +req.file.filename,
            request: {
              type: 'GET',
              description: 'Retorna todos as imagens',
              url: process.env.URL_ADM + 'produtos/' + productId+ '/image'
          }
          },
        };
  
        res.status(201).send(response);
      
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  
  // listando as imagens de um produto
  listarimagem: async (req, res) => {
    // try catch trata o error
    try {
    
      const { productId } = req.params;
      const resultado = await mysql.execute("SELECT * FROM productimages where productId=? ;",[productId]);
  
      const response = {
        quantidade: resultado.length,
        image: resultado.map((img) => {
          return {
            //parseInt - numero inteiro
            productId:parseInt(productId),
            imageId: img.imageId,
            path: process.env.URL_ADM + img.path,
            
          };
        }),
      };
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  
  delete: async (req, res) => {
    try {

        
      const { imageId, productId} = req.params;
     
     
   
      const resultado = await mysql.execute(
        "SELECT * FROM productimages WHERE imageId=?;",
        [imageId]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado produto com esse Id= ${imageId}`,
        });
      }
     
     
      // cadastrar no banco de dados
      await mysql.execute(
        `DELETE FROM productimages
      WHERE imageId=?`,
        [imageId]
      );
         const response = {
        messagem: "Imagem Deletada com Sucesso",
        request: {
            request: {
                type: 'POST',
                descricao: 'Insere uma imagem',
                url: process.env.URL_ADM + 'produtos/' + productId+ '/image',
         
                body: {
                    productId: "Number",
                    path: "File"
        
                  },
         
            }
        
        
        
           
         
         
        },
      };

      res.status(202).send(response);
    } catch (error) {
      return res.status(500).json({ error:error });
    }
  },

}
module.exports = imagensController;