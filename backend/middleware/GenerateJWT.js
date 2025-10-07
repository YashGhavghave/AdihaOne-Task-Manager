import JWT from 'jsonwebtoken';

const JWT_SECRET = 'ADGAG#$%ADQT235@#RAG#@';

export const GenerateToken = (id, email)=>{
    return JWT.sign({id, email}, JWT_SECRET, {expiresIn: '1d'});
}