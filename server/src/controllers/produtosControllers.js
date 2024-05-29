const mysql = require("../db/config/config").pool;
//inserir imagem

const produtosControllers = {
  //criar listar imagem
  listar: (req, res) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query("SELECT * FROM produtos", (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
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
      });
    });
  },
  //cadastrar
  criar: async (req, res) => {
    // receber dados enviados no corpo
    // try{
    const { nome, preco } = req.body;
    const { image } = req.file;
    console.log(req.file);
    console.log(req.user);
    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      // verificando se o nome existe
      conn.query(
        "SELECT * FROM produtos WHERE nome=?;",
        [nome],
        (error, resultado, field) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
          if (resultado.length > 0) {
            return res.status(409).send({
              messagem: `Produto ${nome} já cadastrado`,
            });
          } else {
            conn.query(
              "INSERT INTO produtos(nome, preco,image) VALUES (?,?,?)",
              [nome, preco, image],
              (error, resultado, field) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
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
            );
          }
        }
      );
    });
  },

  ler: async (req, res) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
        "SELECT * FROM produtos WHERE id=?;",
        [id],
        (error, resultado, field) => {
          if (error) {
            return res.status(500).send({ error: error });
          }
          if (resultado.length == 0) {
            return res.status(404).send({
              messagem: "Não foi encontrado produto com esse Id",
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
        }
      );
    });
  },

  update: async (req, res) => {
    const { nome, preco } = req.body;
    const { image } = req.file;
    const { id } = req.params;
    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
   
      conn.query(
        `UPDATE produtos
   SET nome=?, preco=?,image=? WHERE id=?`,
        [nome, preco, image, id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
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
        }
      );
    });
  },

  delete: async (req, res) => {
    const { id } = req.params;
    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
        `DELETE FROM produtos
      WHERE id=?`,
        [id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
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
      );
    });
  },
};
module.exports = produtosControllers;
