const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const methodOverride = require('method-override');

const app = express();

// Configuração do body-parser para obter dados de formulários HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

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
      <td><a href="http://localhost:3000/alterar/${person.id}">alterar</a></td>
      <td><a href="http://localhost:3000/excluir/${person.id}">excluir</a></td>
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
app.get('/alterar/:id', (req, res) => {

  const sql = 'SELECT * FROM cadastro WHERE id = ?';
  const id = req.params.id;
  

  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    
    const person = results[0];
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualizar Dados</title>
    </head>
    <body>
    <h1>Atualizar Dados</h1>
    <form action="/atualizar/${id}?_method=PUT" method="POST">
      <label for="usuario">Nome:</label><br>
      <input type="text" id="usuario" name="usuario" value="${person.usuario}" required><br>
      <label for="email">Email:</label><br>
      <input type="email" id="email" name="email" value="${person.email}" required><br>
      <label for="telefone">Telefone:</label><br>
      <input type="tel" id="telefone" name="telefone" value="${person.telefone}" required><br><br>
      <button type="submit">Atualizar</button>
    </form>
    </body>
    </html>`;

    res.send(html);
  });
});



// Rota para deletar os dados da tabela
app.get('/excluir/:id', (req, res) => {
  
  const sql = 'DELETE FROM cadastro WHERE id= ?';
  const id = req.params.id;
  
  db.query(sql, [id], (err, results) => {
    if (err) throw err;
    res.redirect('/lista');
});
  });

app.put('/atualizar/:id', (req, res) => {
  
  const sql = 'UPDATE cadastro SET usuario = ?, email = ?, telefone = ? WHERE id = ?';
  const { usuario, email, telefone } = req.body;
  const id = req.params.id;
  
  db.query(sql, [usuario,email,telefone,id], (err, results) => {
    if (err) throw err;
    res.redirect('/lista');
});
  });


// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });