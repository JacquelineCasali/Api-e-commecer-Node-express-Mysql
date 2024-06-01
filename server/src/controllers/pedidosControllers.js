const mysql = require("../db/config/config");
//const mysql= require('../db/models/pedidos').pool
const pedidosControllers = {
  listar: async (req, res) => {
    try {
      // trazendo a tabela produto tambem inner join

      const resultado = await mysql.execute(
        // `SELECT * FROM pedidos `

        ` SELECT * FROM pedidos INNER JOIN produtos ON produtos.id = pedidos.produtoId`
      );

      const response = {
        pedidos: resultado.map((pedido) => {
          return {
            id: pedido.id,
            quantidade: pedido.quantidade,
            produto: {
              produtoId: pedido.produtoId,
              nome: pedido.nome,
              preco: pedido.preco,
              image: process.env.URL_ADM + pedido.image,
            },

            request: {
              tipo: "Get",
              descricao: "Retorna todos os pedidos",
              url: process.env.URL_ADM + "pedidos/" + pedido.id,
            },
          };
        }),
      };
      return res.status(200).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
  //cadastrar
  criar: async (req, res) => {
    try {
      const { produtoId, quantidade } = req.body;
      const resultado = await mysql.execute(
        "SELECT * FROM produtos WHERE id=?;",
        [req.body.produtoId]
      );

      if (resultado.length == 0) {
        return res.status(404).send({
          messagem: "Produto Não Encotrado",
        });
      } else {
        mysql.execute(
          "INSERT INTO pedidos(produtoId, quantidade) VALUES (?,?)",
          [produtoId, quantidade]
        );

        const response = {
          messagem: "Pedido Criado com sucesso",
          pedidoCriado: {
            id: resultado.id,
            produtoId,
            quantidade,

            request: {
              tipo: "POST",
              descricao: "Retorna todos os pedidos",
              url: "http://localhost:3000/pedidos",
            },
          },
        };

        res.status(201).send(response);
      }
      // cadastrar no banco de dados
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  ler: async (req, res) => {
    try {
      const { id } = req.params;

      const resultado = await mysql.execute(
        "SELECT * FROM pedidos WHERE id=?;",
        [id]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          messagem: "Não foi encontrado pedido com esse Id",
        });
      }
      const response = {
        pedido: {
          id: resultado[0].id,
          nome: resultado[0].nome,
          quantidade: resultado[0].quantidade,

          request: {
            tipo: "Get",
            descricao: "Retorna o Detalhe do pedido",
            url: "http://localhost:3000/pedidos",
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
      const { produtoId, quantidade } = req.body;
      const { id } = req.params;
      // cadastrar no banco de dados

      const resultado = await mysql.execute(
        "SELECT * FROM produtos WHERE id=?;",
        [produtoId]
      );

      if (resultado.length == 0) {
        return res.status(404).send({
          messagem: "Produto Não Encotrado",
        });
      } else {
        mysql.execute(
          `UPDATE pedidos SET produtoId=?, quantidade=? WHERE id=?`,
          [produtoId, quantidade, id]
        );
        const response = {
          messagem: "Pedido Atualizado com Sucesso",
          pedidoAtualizado: {
            id,
            produtoId,
            quantidade,

            request: {
              tipo: "PUT",
              descricao: "Retorna o detalhe do pedido",
              url: "http://localhost:3000/pedidos/" + id,
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
      const { id } = req.params;
      // cadastrar no banco de dados
      await mysql.execute(`DELETE FROM pedidos  WHERE id=?`, [id]);

      const response = {
        messagem: "Pedido Deletado com Sucesso",
        request: {
          tipo: "POST",
          descricao: "Cadastra um pedido",
          url: "http://localhost:3000/pedidos",
          body: {
            produtoId: "Number",
            quantidade: "Number",
          },
        },
      };

      res.status(202).send(response);
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
};
module.exports = pedidosControllers;
