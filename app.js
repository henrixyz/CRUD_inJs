const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

// Configuração do body-parser para obter dados de formulários HTML
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql2024',
  database: 'crud_nodejs'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL!');
  });


// Configuração da rota para exibir o formulário HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
// Rota para processar o formulário de cadastro
app.post('/cadastro', (req, res) => {
  const { usuario, email, telefone } = req.body;
  const sql = 'INSERT INTO cadastro (usuario, email, telefone) VALUES (?, ?, ?)';
  db.query(sql, [usuario, email, telefone], (err, result) => {
    if (err) throw err;
      res.send('Cadastro realizado com sucesso!');
  });
});



// Rota para exibir os dados da tabela
app.get('/lista', (req, res) => {
  const sql = 'SELECT * FROM cadastro';
  db.query(sql, (err, results) => {
    if (err) throw err;
    
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Pessoas</title>
    </head>
    <body>
    <h1>Lista de Pessoas</h1>
    <table border="1">
    <tr>
    <th>ID</th>
    <th>Nome</th>
    <th>Email</th>
    <th>Telefone</th>
    <th>Alterar</th>
    <th>Excluir</th>

    </tr>`;
    
    results.forEach(person => {
      html += `
      <tr>
      <td>${person.id}</td>
      <td>${person.usuario}</td>
      <td>${person.email}</td>
      <td>${person.telefone}</td>
      <td><a href="/alterar.id">alterar</a></td>
      <td><a href="/excluir.id">excluir</a></td>
      </tr>`;
    });

    html += `
    </table>
    </body>
    </html>`;
    
    res.send(html);
  });
});




// Rota para alterar os dados da tabela
app.get('/alterar.id', (req, res) => {
  const sql = 'SELECT * FROM cadastro';
  db.query(sql, (err, results) => {
    if (err) throw err;
    
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Pessoas</title>
    </head>
    <body>
    <h1>Lista de Pessoas</h1>
    <table border="1">
    <tr>
    <th>ID</th>
    <th>Nome</th>
    <th>Email</th>
    <th>Telefone</th>
    <th>Alterar</th>
    </tr>`;
    

    
    results.forEach(person => {
      html += `
      <tr>
      <td>${person.id}</td>
      <td>${person.usuario}</td>
      <td>${person.email}</td>
      <td>${person.telefone}</td>
      <td><button>alterar</button></td>
      </tr>`;
    });
    
    html += `
    </table>
    </body>
    </html>`;
    
    res.send(html);
  });
});




// Rota para deletar os dados da tabela
app.get('/listaDel', (req, res) => {
  const sql = 'DELETE * FROM cadastro';
  db.query(sql, (err, results) => {
    if (err) throw err;
    
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Pessoas</title>
    </head>
    <body>
    <h1>Lista de Pessoas</h1>
    <table border="1">
    <tr>
    <th>ID</th>
    <th>Nome</th>
    <th>Email</th>
    <th>Telefone</th>
    </tr>`;
    
    results.forEach(person => {
      html += `
      <tr>
      <td>${person.id}</td>
      <td>${person.usuario}</td>
      <td>${person.email}</td>
      <td>${person.telefone}</td>
      </tr>`;
    });
    
    html += `
    </table>
    </body>
    </html>`;
    
    res.send(html);
  });
});


// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });