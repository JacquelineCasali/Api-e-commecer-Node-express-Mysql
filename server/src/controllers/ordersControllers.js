const mysql = require("../db/config/config");
//const mysql= require('../db/models/pedidos').pool
const ordersControllers = {
  listar: async (req, res) => {
    try {
      // trazendo a tabela produto tambem inner join

      const resultado = await mysql.execute(
      
    ` SELECT orders.orderId,orders.quantity,
    products.productId,  products.name,  products.price, products.image
    FROM orders INNER JOIN 
    products ON products.productId = orders.productId`
    
  );

      const response = {
        orders: resultado.map((order) => {
          return {
           
            orderId: order.orderId,
            quantity: order.quantity,
            product: {
              productId: order.productId,
              name: order.name,
              price: order.price,
              image: process.env.URL_ADM + order.image,
              
          },
        
            request: {
              type: "Get",
              descricao: "Retorna  os detalhe dos pedidos",
              url: process.env.URL_ADM + "pedidos/" + order.orderId,
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
      const { productId, quantity } = req.body;
      var resultado = await mysql.execute(
        "SELECT * FROM products WHERE productId=?;",
        [productId]
      );

      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Produto Não Encotrado `,
        });
      } else {
        var resultado = await  mysql.execute(
          "INSERT INTO orders(productId, quantity) VALUES (?,?)",
          [productId, quantity]
        );

        const response = {
          message: "Pedido Criado com sucesso",
          createdOrder: {
         
           
            orderId: resultado.insertId,
            productId,
            quantity,

            request: {
              type: "POST",
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
      const { orderId } = req.params;

      const resultado = await mysql.execute(
        "SELECT * FROM orders WHERE orderId=?;",
        [orderId]
      );
      if (resultado.length == 0) {
        return res.status(404).send({
          message: `Não foi encontrado pedido com esse Id=${orderId}`,
        });
      }
      const response = {
        orders: {
          
          orderId: resultado[0].orderId,
          productId: resultado[0].productId, 
          quantity: resultado[0].quantity,
         
          request: {
            type: "Get",
            descricao: "Retorna o todos os pedidos",
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
      const { productId, quantity } = req.body;
      const { orderId } = req.params;
      // cadastrar no banco de dados

      const resultado = await mysql.execute(
        "SELECT * FROM products WHERE productId=?;",
        [productId]
      );

      if (resultado.length == 0) {
        return res.status(404).send({
          message: "Produto Não Encotrado",
        });
      } else {
        mysql.execute(
          `UPDATE orders SET productId=?, quantity=? WHERE orderId=?`,
          [productId, quantity, orderId]
        );
        const response = {
          message: "Pedido Atualizado com Sucesso",
          upatedOrder: {
            orderId,
            productId,
            quantity,

            request: {
              type: "PUT",
              descricao: "Retorna o detalhe do pedido",
              url: "http://localhost:3000/pedidos/" + orderId,
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
        const { orderId } = req.params;
        const resultado = await mysql.execute(
          "SELECT * FROM orders WHERE orderId=?;",
          [orderId],
        );
        if (resultado.length == 0) {
          return res.status(404).send({
            message: `Não foi encontrado pedido com esse Id= ${orderId}`,
          });
        }else{
      // cadastrar no banco de dados
      await mysql.execute(`DELETE FROM orders  WHERE orderId=?`, [orderId]);

      const response = {
        message: "Pedido Deletado com Sucesso",
        request: {
          type: "POST",
          descricao: "Cadastra um pedido",
          url: "http://localhost:3000/pedidos",
          body: {
            productId: "Number",
            quantity: "Number",
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
module.exports = ordersControllers;
