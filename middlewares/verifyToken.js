const jwt = require('jsonwebtoken');
const SECRET = 'micha_chave_super_secreta';

function verifyToken(req, res, next){
	const authHeader = req.headers.authorization;
	if (!authHeader){
		return res.status(401).json({
			error: 'Token não enviado'
		});
	}
	const token = authHeader.split(' ')[1];
	try{
		const decoded = jwt.verify(token, SECRET);
		console.log(decoded)
		req.user = decoded;
		next();
	}catch (error){
		return res.status(403).json({
			error: 'Token inválido'
		});
	}
}
module.exports = verifyToken;