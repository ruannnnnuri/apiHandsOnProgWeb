const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const jsYaml = require('js-yaml');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Sou o Projeto de Node + Express!');
});

app.listen(3000, () =>{
	console.log('running at http://localhost:3000');
});

const swaggerFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDocument = jsYaml.load(fs.readFileSync(swaggerFilePath, 'utf8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/posts', (req, res) => {
	const caminhoArquivo = path.join(__dirname, 'publicacoes.json');
	res.sendFile(caminhoArquivo);
});