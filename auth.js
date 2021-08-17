const jwt = require('jsonwebtoken')

const auth = {}

auth.verifyToken = (req, res, next)=>{
    if (!req.headers.authorization){
        return res.status(401).send('no autorizado')
    }

    const token = req.headers.authorization.split(' ')[1]

    if (token == null){
        return res.status(401).send('no autorizado')
    }

    const payload = jwt.verify(token, 'secretpass')
    req.payload = payload;

    next()
}

module.exports = auth