import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/User.js';
import UserMessage from './models/UserMessage.js'
import Post from './models/Post.js'
import Event from './models/Event.js'
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

app.post('/contact', async (req, res) => {
    const { username, message, email, phone } = req.body;
    try {


        const userDoc = await UserMessage.create({
            username, 
            message,  // Armazena o hash da senha, não a senha em texto simples
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

app.get('/profile', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(200).json(null); // ✅ Retorna null em vez de erro
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            console.error("Erro ao verificar token:", err);
            return res.status(403).json({ error: "Token inválido" });
        }
        res.json(info);
    });
});

app.get('/renew-token', (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: "Token não encontrado" });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                const newToken = jwt.sign({ username: info.username, id: info.id }, secret, { expiresIn: '1h' });
                res.cookie('token', newToken);
                return res.json({ token: newToken });
            }
            return res.status(403).json({ error: "Token inválido" });
        }
        res.json({ message: "Token ainda válido" });
    });
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

app.delete('/post/:id', async (req, res) => {
    const { id } = req.params;

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

            await Post.deleteOne({ _id: id });

            res.json({ message: 'Post deletado com sucesso' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar post', details: err.message });
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


  app.post('/event', uploadMiddleware.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
    }

    const { originalname, path: tempPath } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = `${tempPath}.${ext}`;
    const { title, description,summary, date, location } = req.body;

    try {
        fs.renameSync(tempPath, newPath);
        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const eventDoc = await Event.create({
                title,
                description,
                summary,
                date,
                location,
                cover: newPath,
                organizer: info.id,
            });

            res.json({ eventDoc });
        });

    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar evento', details: err.message });
    }
});

// Deletar evento
app.delete('/event/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Converter o id para ObjectId
        const objectId = new mongoose.Types.ObjectId(id);

        // Verificar token
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            // Encontrar o evento antes de deletar
            const eventDoc = await Event.findById(objectId);
            if (!eventDoc) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }

            // Verificar se o usuário é o organizador do evento
            if (eventDoc.organizer.toString() !== info.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }

            // Deletar o evento
            await Event.deleteOne({ _id: objectId });

            res.json({ message: 'Evento deletado com sucesso' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao deletar evento', details: err.message });
    }
});



app.get('/event', async (req, res) => {
    res.json(await Event.find()
        .populate('organizer', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    );
});

app.get('/event/:id', async (req, res) => {
    const { id } = req.params;
    const eventDoc = await Event.findById(id).populate('organizer', ['username']);
    res.json(eventDoc);
});

app.put('/event/:id', uploadMiddleware.single('file'), async (req, res) => {
    const { id } = req.params;
    const { title, description, summary, date, location } = req.body;
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

            const eventDoc = await Event.findById(id);
            if (!eventDoc) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }

            if (eventDoc.organizer.toString() !== info.id) {
                return res.status(403).json({ error: 'Acesso negado' });
            }

            eventDoc.title = title;
            eventDoc.description = description;
            eventDoc.summary = summary;
            eventDoc.date = date;
            eventDoc.location = location;
            if (newPath) {
                eventDoc.cover = newPath;
            }

            await eventDoc.save();
            res.json(eventDoc);
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar evento', details: err.message });
    }
});



app.listen(4000);

// mongodb+srv://paulongf:tntFYLvIy2mmZrUi@cluster0.w8qeg.mongodb.net/