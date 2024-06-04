const mysql = require("../db/config/config");
// criptografar senha
const bcrypt = require("../middleware/bcrypt");

const usersControllers = {
  //criar listar imagem
  listar: async (req, res) => {
    try {
      const resultado = await mysql.execute(`SELECT * FROM users ORDER BY email`);

      const response = {
        quantidadedeUsuarios: resultado.length,
        users: resultado.map((user) => {
          return {
            userId: user.userId,
            email: user.email,

            request: {
              type: "Get",
              descricao: "Retorna o detalhe dos usuarios",
              url: process.env.URL_ADM + user.userId,
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
      const users = req.body.users.map((user) => [
        user.email,
        bcrypt.generateHash(user.password),
      ]);

      await mysql.execute('INSERT INTO users (email, password) VALUES ?', [
        users
      ]);

      const response = {
        message: "Usuários criado com sucesso",
        //trazendo todos os usuarios
        createdUsers: req.body.users.map((user) => {
          return {
            email: user.email,
          };
        }),
      };

      return res.status(201).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Email já cadastrado" });
    }
  },

  ler: async (req, res) => {
    try {
      const { userId } = req.params;

      const resultado = await mysql.execute(
        "SELECT * FROM users WHERE userId=?;",
        [userId]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado usuario com esse Id=${userId}`,
        });
      }
      const response = {
        users: {
          userId: resultado[0].userId,
          email: resultado[0].email,

          request: {
            type: "Get",
            descricao: "Retorna todos os usuarios",
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
      const { email, password } = req.body;
      const { userId } = req.params;
      // cadastrar no banco de dados

      await mysql.execute(
        `UPDATE users
   SET email=?, password=? WHERE userId=?`,
        [email, bcrypt.generateHash(password), userId]
      );

      const response = {
        message: "Usuário Atualizado com Sucesso",
        upateduser: {
          userId,
          email,
          request: {
            tipo: "PUT",
            descricao: "Retorna o detalhe do usuário",
            url: process.env.URL_ADM + userId,
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
      const { userId } = req.params;

      const resultado = await mysql.execute(
        "SELECT * FROM users WHERE userId=?",
        [userId]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado usuário com esse Id= ${userId}`,
        });
      } else {
        // cadastrar no banco de dados
        await mysql.execute(
          `DELETE FROM users
      WHERE userId=?`,
          [userId]
        );

        const response = {
          message: `Usuário Deletado com Sucesso `,
        };

        res.status(202).send(response);
      }
    } catch (error) {
      return res.status(500).send({ error: error });
    }
  },
};
module.exports = usersControllers;
