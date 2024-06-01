//const mysql = require("../db/config/config").pool;
const mysql = require("../db/config/config");


const produtosControllers = {


  listar: async (req, res) => {
    // try catch trata o error
    try {
      const resultado = await mysql.execute("SELECT * FROM produtos;");

      const response = {
        quantidade: resultado.length,
        produtos: resultado.map((prod) => {
          return {
            id: prod.id,
            nome: prod.nome,
            preco: prod.preco,
            image: process.env.URL_ADM + prod.image,

            request: {
              tipo: "Get",
              descricao: "Retorna todos os produtos",
              url: process.env.URL_ADM + "produtos/" + prod.id,
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
      const { nome, preco } = req.body;
      const { image } = req.file;
      console.log(req.file);
      console.log(req.user);
      // cadastrar no banco de dados
      var resultado = await mysql.execute(
        "SELECT * FROM produtos WHERE nome=?;",
        [nome]
      );
      if (resultado.length > 0) {
        return res.status(409).send({
          messagem: `Produto ${nome} já cadastrado`,
        });
      } else {
        var resultado = mysql.execute(
          "INSERT INTO produtos(nome, preco,image) VALUES (?,?,?)",
          [nome, preco, image]
        );
        const response = {
          messagem: "Produto Criado com sucesso",
          produtoCriado: {
            id: resultado.id,
            nome,
            preco,
            image: process.env.URL_ADM + image,
            request: {
              tipo: "POST",
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
      const { id } = req.params;
      const resultado = await mysql.execute(
        "SELECT * FROM produtos WHERE id=?;",
        [id]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          messagem: `Não foi encontrado produto com esse Id= ${id}`,
        });
      }
      const response = {
        produto: {
          id: resultado[0].id,
          nome: resultado[0].nome,
          preco: resultado[0].preco,
          image: process.env.URL_ADM + resultado[0].image,
          request: {
            tipo: "Get",
            descricao: "Retorna o Detalhe do Produto",
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
      const { nome, preco } = req.body;
      const { image } = req.file;
      const { id } = req.params;
      // cadastrar no banco de dados
      await mysql.execute(
        `UPDATE produtos
   SET nome=?, preco=?,image=? WHERE id=?`,
        [nome, preco, image, id]
      );

      const response = {
        messagem: "Produto Atualizado com Sucesso",
        produtoAtualizado: {
          id,
          nome,
          preco,
          image: process.env.URL_ADM + image,
          request: {
            tipo: "PUT",
            descricao: "Retorna o detalhe do produto",
            url: process.env.URL_ADM + "produtos/" + id,
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
      const { id } = req.params;
      // cadastrar no banco de dados
      await mysql.execute(
        `DELETE FROM produtos
      WHERE id=?`,
        [id]
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
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
};

module.exports = produtosControllers;
