import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
const secret = 'secretKeyword'

mongoose.connect('mongodb+srv://paulongf:tntFYLvIy2mmZrUi@cluster0.w8qeg.mongodb.net/');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10); // Criptografa a senha antes de armazená-la

        const userDoc = await User.create({
            username, 
            password: hashedPassword  // Armazena o hash da senha, não a senha em texto simples
        });
        
        res.json(userDoc);
    } catch (e) {
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    const userDoc = await User.findOne({ username });
    
    if (!userDoc) {
        return res.status(400).json({ error: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (!passOk) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        
        res.cookie('token', token, {
            httpOnly: true, // Impede acesso via JavaScript no browser (mais seguro)
            secure: true, // Apenas em HTTPS (remova para testes locais)
            sameSite: 'None' // Importante para funcionamento correto com frontend externo
        }).json({ success: true });
    }); 
});


app.listen(4000);

// mongodb+srv://paulongf:tntFYLvIy2mmZrUi@cluster0.w8qeg.mongodb.net/