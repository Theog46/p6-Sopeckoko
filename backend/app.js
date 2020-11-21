const mongoose = require('mongoose');
const path = require('path');

// Connection à mongoose DB //
mongoose.connect('mongodb+srv://admin:caramel@cluster0.kthdl.mongodb.net/sopekocko?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajout d'express et de body parser //
const express = require('express');
const bodyParser = require('body-parser');

// Definition des routes //
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

const app = express();

// Definition requêtes header //
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, '/images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;