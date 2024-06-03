const mysql = require("../db/config/config");
//const mysql= require('../db/models/pedidos').pool
const categoriesControllers = {
  listar: async (req, res) => {
    try {
      // trazendo a tabela produto tambem inner join

      const resultado = await mysql.execute(
      
    ` SELECT *from  categories`
  );
  const response={
    //numero de categoria cadastrada
    length:resultado.length,

    categories: resultado.map((categoria) => {
      return {
       
        categoryId: categoria.categoryId,
        name: categoria.name,
  }
})
  }
            return res.status(200).send(response)
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  //cadastrar
  criar: async (req, res) => {
    // receber dados enviados no corpo
    try {
      const { name} = req.body;
     
      // cadastrar no banco de dados
      const resultado = await mysql.execute(
        "SELECT * FROM categories WHERE name=?;",
        [name]
      );
      if (resultado.length > 0) {
        return res.status(409).send({
          message: `Produto ${name} já cadastrado`,
        });
      } else {
        const resultado =await mysql.execute(
          "INSERT INTO categories(name) VALUES (?)",
          [name]
        );
        const response = {
          message: "Categoria Criada com sucesso",
          createdCategorie: {
            //productId: resultado.insertproductId,
            categoryId: resultado.insertId,
            name,
              request: {
              type: "GET",
              descricao: "Retorna todos as categorias",
              url: process.env.URL_ADM + "categoria/",
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
      const { categoryId } = req.params;

      const resultado = await mysql.execute(
        "SELECT * FROM categories WHERE categoryId=?;",
        [categoryId]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado categoria com esse Id=${categoryId}`,
        });
      }
      
      res.status(200).send(resultado);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  update: async (req, res) => {
    try {
      const { name } = req.body;
      const { categoryId } = req.params;
      // cadastrar no banco de dados

      const resultado = await mysql.execute(
        "SELECT * FROM categories WHERE categoryId=?;",
        [categoryId]
      );

      if (resultado.length == 0) {
        return res.status(404).send({
          message: "Categoria Não Encotrado",
        });
      } else {
        mysql.execute(
        
          `UPDATE categories SET name=? WHERE categoryId=?`,
          [name,categoryId]
        );
        const response = {
          message: "Categoria Atualizado com Sucesso",
          upatedCategories: {
            categoryId:parseInt(categoryId),
            name,
            

            request: {
              type: "PUT",
              descricao: "Retorna o detalhe do pedido",
              url: "http://localhost:3000/categorias/" + categoryId,
            },
          },
        };

        res.status(202).send(response);
      }
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  delete: async (req, res) => {
   

      try {
        const { categoryId } = req.params;
        const resultado = await mysql.execute(
          "SELECT * FROM categories WHERE categoryId=?;",
          [categoryId],
        );
        if (resultado.length == 0) {
          return res.status(404).send({
            message: `Não foi encontrado categoria com esse Id= ${categoryId}`,
          });
        }else{
      // cadastrar no banco de dados
      await mysql.execute(`DELETE FROM categories  WHERE categoryId=?`, [categoryId]);

      const response = {
        message: "Categoria Deletado com Sucesso",
        request: {
          type: "POST",
          descricao: "Cadastra uma categoria",
          url: "http://localhost:3000/categoria",
          body: {
            name: "string",
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
module.exports = categoriesControllers;
