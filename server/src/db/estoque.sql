-- DROP DATABASE IF EXISTS estoque;
-- Cria banco de dados
-- CREATE DATABASE estoque;

-- Seleciona banco de  dados para uso
USE estoque;


-- Cria tabela de usuário

CREATE TABLE IF NOT EXISTS users (
    userId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) unique,
    password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
    productId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(45) unique NOT NULL,
    price FLOAT NOT NULL,
    image VARCHAR(255)
);


-- orders pedidos
CREATE TABLE IF NOT EXISTS orders (
    orderId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (productId) REFERENCES products (productId)
);

CREATE TABLE IF NOT EXISTS productImages (
    imageId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    productId INT ,
    path VARCHAR(255),
    FOREIGN KEY (productId) REFERENCES products (productId)
);




-- Ligação de tabelas
-- ALTER TABLE `estoque`.`pedidos` 
-- ADD CONSTRAINT `id`
--   FOREIGN KEY (`produtoId`)
--   REFERENCES `estoque`.`produtos` (`id`)
--   ON DELETE CASCADE
--   ON UPDATE CASCADE;  



