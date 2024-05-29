const mysql = require("../db/config/config").pool;

const pedidosControllers = {
  listar: (req, res) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      // trazendo a tabela produto tambem inner join 
      conn.query(
        // `SELECT * FROM pedidos `
    
   ` SELECT * FROM pedidos INNER JOIN produtos ON produtos.id = pedidos.produtoId`  
      
      , (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
        
          pedidos: resultado.map((pedido) => {
            return {
              id: pedido.id,
              quantidade: pedido.quantidade,
              produto:{
                produtoId: pedido.produtoId,
                nome:pedido.nome,
                preco:pedido.preco,
                image:process.env.URL_ADM + pedido.image
              },
          
           
              request: {
                tipo: "Get",
                descricao: "Retorna todos os pedidos",
                url: process.env.URL_ADM + "pedidos/"+ pedido.id,
              },
            };
          }),
        };
        return res.status(200).send(response);
      });
    });
  },
  //cadastrar
  criar: async (req, res) => {
     const { produtoId, quantidade } = req.body;
    //verificando se existe o produto
        mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error })}
conn.query(
  "SELECT * FROM produtos WHERE id=?;",
  [req.body.produtoId],
  (error, resultado, field) => {
    if (error) {
      return res.status(500).send({ error: error })}

      if (resultado.length == 0) {
        return res.status(404).send({
          messagem: "Produto Não Encotrado",
        });
      }
    // cadastrar no banco de dados
      conn.query(
        "INSERT INTO pedidos(produtoId, quantidade) VALUES (?,?)",
        [produtoId, quantidade],
        (error, resultado, field) => {
          //fecha conexão
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
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
      )

      
  }) });
  },

  ler: async (req, res) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
       
       
       
        "SELECT * FROM pedidos WHERE id=?;",
        [id],
        (error, resultado, field) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
          if (resultado.length == 0) {
            return res.status(404).send({
              messagem: "Não foi encontrado pedido com esse Id",
            });
          }
          const response = {
            pedido: {
              id: resultado[0].id,
              nome:resultado[0].nome,
              quantidade: resultado[0].quantidade,

              request: {
                tipo: "Get",
                descricao: "Retorna o Detalhe do pedido",
                url: "http://localhost:3000/pedidos",
              },
            },
          };

          res.status(200).send(response);
        }
      );
    });
  },

  update: async (req, res) => {
    const { produtoId, quantidade } = req.body;
    const { id } = req.params;
    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
        "SELECT * FROM produtos WHERE id=?;",
        [req.body.produtoId],
        (error, resultado, field) => {
          if (error) {
            return res.status(500).send({ error: error })}
      
            if (resultado.length == 0) {
              return res.status(404).send({
                messagem: "Produto Não Encotrado",
              });
            }
            conn.query(
        `UPDATE pedidos SET produtoId=?, quantidade=? WHERE id=?`,
        [produtoId, quantidade, id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
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
      );
    }) });
 
  },

  delete: async (req, res) => {
    const { id } = req.params;
    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
        `DELETE FROM pedidos  WHERE id=?`,
        [id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
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
        }
      );
    });
  },
};
module.exports = pedidosControllers;
