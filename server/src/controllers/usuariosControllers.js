const mysql = require("../db/config/config");
// criptografar senha
const bcrypt = require("../middleware/bcrypt");

const usuariosControllers = {
  //criar listar imagem
  listar: async (req, res) => {
    try {
      const resultado = await mysql.execute("SELECT * FROM usuarios");

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
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  //cadastrar
  criar: async (req, res) => {
    try {
      const { email, senha } = req.body;

      // cadastrar no banco de dados
      // verificando se o email já existe
      const resultado = await mysql.execute(
        "SELECT * FROM usuarios WHERE email=?;",
        [email]
      );

      if (resultado.length > 0) {
        return res.status(409).send({
          messagem: `Email ${email} já cadastrado`,
        });
      } else {
        mysql.execute("INSERT INTO usuarios(email, senha) VALUES (?,?)", [
          email,
          bcrypt.generateHash(senha),
        ]);

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
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },

  ler: async (req, res) => {
    try {
      const { id } = req.params;

      const resultado = await mysql.execute(
        "SELECT * FROM usuarios WHERE id=?;",
        [id]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          messagem: `Não foi encontrado usuario com esse Id=${id}`,
        });
      }
      const response = {
        usuarios: {
          id: resultado[0].id,
          email: resultado[0].email,

          request: {
            tipo: "Get",
            descricao: "Retorna o Detalhe do Usuário",
            url: process.env.URL_ADM,
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
      
 
    
    
    const { email, senha } = req.body;
    const { id } = req.params;
    // cadastrar no banco de dados
  

    await mysql.execute(
        `UPDATE usuarios
   SET email=?, senha=? WHERE id=?`,
        [email, bcrypt.generateHash(senha), id],)
     
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
 
        } catch (error) {
          return res.status(500).send({ error: error });
        }
    
  },

  delete: async (req, res) => {
   
   try {
    
  
    const { id } = req.params;
    // cadastrar no banco de dados
    await mysql.execute(
            `DELETE FROM usuarios
      WHERE id=?`,
        [id],)
        
          const response = {
            messagem: "Usuário Deletado com Sucesso",
            
          };

          res.status(202).send(response);
       
        } catch (error) {
          return res.status(500).send({ error: error });
        }
       
        },
      }
module.exports = usuariosControllers;
