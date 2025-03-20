import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import Post from './models/Post.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { info } from 'console';

const app = express();
const uploadMiddleware = multer({dest: 'uploads/'});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
const secret = 'secretKeyword';
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb+srv://paulongf:tntFYLvIy2mmZrUi@cluster0.w8qeg.mongodb.net/');

app.post('/register', async (req, res) => {
    const { username, password, email, phone } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10); // Criptografa a senha antes de armazená-la

        const userDoc = await User.create({
            username, 
            password: hashedPassword,  // Armazena o hash da senha, não a senha em texto simples
            email,
            phone,
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
        
        res.cookie('token', token).json({
            id: userDoc._id,
            username,
        });
    }); 
});

app.get('/profile', (req, res) =>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info)=>{
        if(err) throw err;
        res.json(info);
    })
});

app.post('/logout', (req, res) =>{
    res.cookie('token', '').json('')
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const { originalname, path: tempPath, filename } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${tempPath}.${ext}`;
    const { title, summary, content } = req.body;

    try {
        fs.renameSync(tempPath, newPath);
        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            });

            res.json({ postDoc });  // ✅ Envia a resposta apenas uma vez
        });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao renomear o arquivo', details: err.message });
    }
});

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
    const { id } = req.params;
    const { title, summary, content } = req.body;
    let newPath = null;

    if (req.file) {
        const { originalname, path: tempPath } = req.file;
        const ext = originalname.split('.').pop();
        newPath = `${tempPath}.${ext}`;
        fs.renameSync(tempPath, newPath);
    }

    try {
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const postDoc = await Post.findById(id);
            if (!postDoc) {
                return res.status(404).json({ error: 'Post não encontrado' });
            }

            if (postDoc.author.toString() !== info.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }

            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            if (newPath) {
                postDoc.cover = newPath;
            }

            await postDoc.save();
            res.json(postDoc);
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar post', details: err.message });
    }
});


app.get('/post', async (req,res) => {
    res.json(await Post.find()
    .populate('author', ['username'])
    .sort({createdAt: -1})
    .limit(20)
);
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
  })


app.listen(4000);

// mongodb+srv://paulongf:tntFYLvIy2mmZrUi@cluster0.w8qeg.mongodb.net/