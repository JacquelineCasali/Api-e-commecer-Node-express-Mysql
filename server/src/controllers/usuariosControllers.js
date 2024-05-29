const mysql = require("../db/config/config").pool;
// criptografar senha
const bcrypt = require("../middleware/bcrypt");

const usuariosControllers = {
  //criar listar imagem
  listar: (req, res) => {
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query("SELECT * FROM usuarios", (error, resultado, field) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          quantidadedeUsuarios: resultado.length,
          usuarios: resultado.map((user) => {
            return {
              id: user.id,
              email: user.email,

              request: {
                tipo: "Get",
                descricao: "Retorna todos os usuarios",
                url: process.env.URL_ADM + user.id,
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
   
    const { email, senha } = req.body;

    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      // verificando se o email já existe
      conn.query(
        "SELECT * FROM usuarios WHERE email=?;",
        [email],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }

          if (resultado.length > 0) {
            return res.status(409).send({
              messagem: `Email ${email} já cadastrado` ,
            });
          } else {
                      conn.query(
                "INSERT INTO usuarios(email, senha) VALUES (?,?)",
                [email,  bcrypt.generateHash(senha)],
                (error, resultado, field) => {
                  if (error) {
                    return res.status(500).send({ error: error });
                  }

                  const response = {
                    messagem: "Usuario Criado com sucesso",
                    usuarioCriado: {
                      id: resultado.id,
                      email,

                      request: {
                        tipo: "POST",
                        descricao: "Retorna todos os usuarios",
                        url: process.env.URL_ADM,
                      },
                    },
                  };
                  res.status(201).send(response);
                }
              );
            
          }
        });
    });
  },

  ler: async (req, res) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
      conn.query(
        "SELECT * FROM usuarios WHERE id=?;",
        [id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
          if (resultado.length == 0) {
            return res.status(404).send({
              messagem: "Não foi encontrado usuario com esse Id",
            });
          }
          const response = {
            usuarios: {
              id: resultado[0].id,
              email: resultado[0].nome,

              request: {
                tipo: "Get",
                descricao: "Retorna o Detalhe do Usuário",
                url: process.env.URL_ADM,
              },
            },
          };

          res.status(200).send(response);
        }
      );
    });
  },

  update: async (req, res) => {
    const { email, senha } = req.body;
    const { id } = req.params;
    // cadastrar no banco de dados
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ error: error });
      }
 
      conn.query(
        `UPDATE usuarios
   SET email=?, senha=? WHERE id=?`,
        [email, bcrypt.generateHash(senha), id],
        (error, resultado, field) => {
          conn.release();
          if (error) {
            return res.status(500).send({ error: error });
          }
          const response = {
            messagem: "Usuário Atualizado com Sucesso",
            usuarioAtualizado: {
              id,
              email,
              request: {
                tipo: "PUT",
                descricao: "Retorna o detalhe do usuário",
                url: process.env.URL_ADM + id,
              },
            },
          };

          res.status(202).send(response);
        })
       
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
            messagem: "Usuário Deletado com Sucesso",
            request: {
              tipo: "POST",
              descricao: "Cadastra um usuário",
              url: process.env.URL_ADM,
              body: {
                email: "String",
                senha: "String",
              },
            },
          };

          res.status(202).send(response);
        }
      );
    });
  },
};
module.exports = usuariosControllers;
