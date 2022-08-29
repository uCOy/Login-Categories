const express = require('express');
const app = express();
require('dotenv').config();
var cors = require('cors');

// ********** trabalhar com arquivos FS file system ********** //
const fs = require('fs');

// ********** Caminho de pasta path ********** //
const path = require('path');

// ********** Caminho para pasta upload ********** //
app.use('/files', express.static(path.resolve(__dirname, "public", "upload")))

const router = require('./routes/index');

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    app.use(cors());
    next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', function (request, response) {
    response.send('Serviço API Rest iniciada...');
});

app.use(router);

app.listen(process.env.PORT,() => {
    console.log(`Servico iniciado na porta ${process.env.PORT} http://localhost:${process.env.PORT}`);
});