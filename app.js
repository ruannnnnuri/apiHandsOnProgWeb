require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

const app = express();

const { Pool } = require('pg');

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use(authRoutes);

const verifyToken = require('./middlewares/verifyToken');

app.get('/', (req, res) => {
	res.send('Sou o Projeto de Node + Express!');
});

app.get('/users', async (req, res) => {
	try {
		const query = 'SELECT * FROM users';
		const result = await pool.query(query);
		res.json(result.rows);
	}catch (err) {
		console.error(err);
		res.status(500).json({error: 'An error occurred'});
	}
})

app.post('/users', async (req, res) => {
	try {
		const {name, email} = req.body;
		const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
		const values = [name, email];
		const result = await pool.query(query, values);
		res.json(result.rows[0]);
	} catch (err){
		console.error(err);
		res.status(500).json({error: 'An error occurred'});
	}
})

app.listen(3000, () =>{
	console.log('running at http://localhost:3000');
});

const swaggerFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = jsYaml.load(fs.readFileSync(swaggerFilePath, 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/posts', verifyToken, (req, res) => {
	const caminhoArquivo = path.join(__dirname, 'publicacoes.json');
	res.sendFile(caminhoArquivo);
});