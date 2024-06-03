//const mysql = require("../db/config/config").pool;
const mysql = require("../db/config/config");


const productControllers = {


  listar: async (req, res) => {
    // try catch trata o error
    try {
      const resultado = await mysql.execute("SELECT * FROM products;");

      const response = {
        quantidade: resultado.length,
        product: resultado.map((prod) => {
          return {
            productId: prod.productId,
            name: prod.name,
            price: prod.price,
            image: process.env.URL_ADM + prod.image,

            request: {
              type: "Get",
              descricao: "Retorna o detalhe do produto",
              url: process.env.URL_ADM + "produtos/" + prod.productId,
            },
          };
        }),
      };
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  criar: async (req, res) => {
    // receber dados enviados no corpo
    try {
      const { name, price } = req.body;
      const { image } = req.file;
      console.log(req.file);
      console.log(req.user);
      // cadastrar no banco de dados
      var resultado = await mysql.execute(
        "SELECT * FROM products WHERE name=?;",
        [name]
      );
      if (resultado.length > 0) {
        return res.status(409).send({
          message: `Produto ${name} já cadastrado`,
        });
      } else {
        var resultado =await mysql.execute(
          "INSERT INTO products(name, price,image) VALUES (?,?,?)",
          [name, price, image]
        );
        const response = {
          message: "Produto Criado com sucesso",
          createdProduct: {
            //productId: resultado.insertproductId,
            productId: resultado.insertId,
            name,
            price,
            image: process.env.URL_ADM + image,
            request: {
              type: "GET",
              descricao: "Retorna todos os produtos",
              url: process.env.URL_ADM + "produtos/",
            },
          },
        };

        res.status(201).send(response);
      }
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  ler: async (req, res) => {
    try {
      const { productId } = req.params;
      const resultado = await mysql.execute(
        "SELECT * FROM products WHERE productId=?;",
        [productId]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado produto com esse Id= ${productId}`,
        });
      }
      const response = {
        product: {
          productId: resultado[0].productId,
          name: resultado[0].name,
          price: resultado[0].price,
          image: process.env.URL_ADM + resultado[0].image,
          request: {
            type: "Get",
            descricao: "Retorna o todos do Produto",
            url: process.env.URL_ADM + "produtos",
          },
        },
      };

      res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  update: async (req, res) => {
    try {
      const { name, price } = req.body;
      const { image } = req.file;
      const { productId } = req.params;
      // cadastrar no banco de dados
      await mysql.execute(
        `UPDATE products
   SET name=?, price=?,image=? WHERE productId=?`,
        [name, price, image, productId]
      );

      const response = {
        message: "Produto Atualizado com Sucesso",
        upatedProduct: {
          productId:parseInt(productId),
          name,
          price,
          image: process.env.URL_ADM + image,
          request: {
            type: "PUT",
            descricao: "Retorna o detalhe do produto",
            url: process.env.URL_ADM + "produtos/" + productId,
          },
        },
      };

      res.status(202).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  delete: async (req, res) => {
    try {
      const { productId } = req.params;
     
      const resultado = await mysql.execute(
        "SELECT * FROM products WHERE productId=?;",
        [productId],
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado produto com esse Id= ${productId}`,
        });
      }else{
     
     
     
     
     
      // cadastrar no banco de dados
      await mysql.execute(
        `DELETE FROM products
      WHERE productId=?`,
        [productId]
      );

      const response = {
        messagem: "Produto Deletado com Sucesso",
        request: {
          tipo: "POST",
          descricao: "Cadastra um produto",
          url: process.env.URL_ADM + "produtos",
          body: {
            nome: "String",
            preco: "Number",
            image: "String",
          },
        },
      };

      res.status(202).send(response);
    }
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },




};

module.exports = productControllers;
