const express = require('express');
const port=process.env.PORT ||  3000;
const cors = require("cors");
const bodyParser=require('body-parser')
const path=require('path')
const morgan = require("morgan");
const app = express();

const productRoutes=require('./src/routes/productRoutes')
const ordersRoutes=require('./src/routes/ordersRoutes')
const usersRoutes=require('./src/routes/usersRoutes')
const imageRoutes=require('./src/routes/imageRoutes')
const categoriesRoutes=require('./src/routes/categoriesRoutes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//resposta no console sobre a aplicação
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,"uploads")));

app.use(bodyParser.urlencoded({extended:false}));//apenas dados simples
app.use(bodyParser.json());//apenas  json


// cabeçalho
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
      'Access-Control-Allow-Header',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).send({});
  }
  next();
});



app.use("/categoria",categoriesRoutes);
app.use("/produtos",imageRoutes);
app.use("/produtos",productRoutes);
app.use("/pedidos",ordersRoutes);
app.use("/",usersRoutes);




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
