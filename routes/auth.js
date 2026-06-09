const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SECRET = 'micha_chave_super_secreta';

router.post('/login', (req, res) => {
	const { email, password } = req.body;
	if (email!== 'admin@email.com' || password !== '123456') {
		return res.status(401).json({
			error: 'Email ou senha inválidos'
		});
	}

	const token = jwt.sign(
		{ email: email, role: 'admin'},
		SECRET,
		{ expiresIn: '1h' }
	);

	res.json({
		message: 'Login realizado com sucesso',
		token: token
	});
});
module.exports = router;