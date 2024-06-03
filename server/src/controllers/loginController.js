const mysql = require("../db/config/config")
// criptografar senha
const bcrypt = require("../middleware/bcrypt");
const jwt = require("jsonwebtoken");
//const bcrypt = require("bcrypt");
const loginController = {
  //cadastrar
  login: async (req, res) => {
    // receber dados enviados no corpo
     try{
    const { email, password } = req.body;

    // cadastrar no banco de dados
      // verificando se o email já existe
      const query = `SELECT * FROM users WHERE email=?`;

      const resultado = await mysql.execute(query, [email],)
        
       
        //verificando se tem registro
        if (resultado.length < 1) {
          return res.status(401).send({
            messagem: "Falha na autenticação",
          });
        }
        const userSenha = bcrypt.compareHash(password, resultado[0].password);

        if (!userSenha) {
          return res.status(401).json({ message: `Falha na autenticação ` });
        }
        if (userSenha) {
          const token = jwt.sign(
            { userId: resultado[0].userId, email: resultado[0].email },

            process.env.APP_SECRET,

            { expiresIn: "1h" }
          );

          return res
            .status(200)
            .send({ messagem: "Autenticado com sucesso", token: token });
        }
        return res.status(401).send({ messagem: "Falha na autenticação" });
      
    } catch (error) {
      return res.status(500).send({ error: error });
    }
    }
  }
module.exports = loginController;
