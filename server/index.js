const express = require('express');
const port=process.env.PORT ||  3000;
const cors = require("cors");
const bodyParser=require('body-parser')
const path=require('path')
const morgan = require("morgan");
const app = express();
//const ola =require('./uploads')
const produtoRoutes=require('./src/routes/produtoRoutes')
const pedidosRoutes=require('./src/routes/pedidosRoutes')
const usuariosRoutes=require('./src/routes/usuariosRoutes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//resposta no console sobre a aplicação
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,"uploads")));

app.use(bodyParser.urlencoded({extended:false}));//apenas dados simples
app.use(bodyParser.json());//apenas  json


// cabeçalho
app.use((req,res,next)=>{
res.header('Origin','X-Requested-With','Content-Type','Accept','Authorization')


 next();
})

app.use("/produtos",produtoRoutes);
app.use("/pedidos",pedidosRoutes);
app.use("/",usuariosRoutes);

// quando não encontra a rota
app.use((req,res,next)=>{
  const erro=new Error('Não encontrado');
  erro.status=404;
  next(erro);
 
})

app.use((error,req,res,next)=>{
res.status(error.status|| 500);
 return res.send({
  erro:{
    mensagem:error.message
  }
 })
 
})

app.listen(port, () => {
  console.log("Estamos rodando em: http://localhost:" + port );
});
