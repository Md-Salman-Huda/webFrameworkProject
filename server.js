const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 8000;
const router = require('./routes/movieRoutes');
const bodyparser = require('body-parser');
const connectDB = require('./config/db');
const app = express();
const cookieParser = require('cookie-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')


// app.use(bodyparser.urlencoded({'extended':'true'}));  
// app.use(bodyparser.json()); 
// app.use(bodyparser.json({ type: 'application/vnd.api+json' }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

connectDB();





const exphbs = require('express-handlebars');
const path = require('path');
app.use(express.json());
app.use(cookieParser());

// const hbs = exphbs.create({
//     // Other configuration options...
//     runtimeOptions: {
//       allowProtoMethodsByDefault: true,
//       allowProtoPropertiesByDefault: true,
//       allowedProtoProperties: true
//     },
//   });
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutDir: path.join(__dirname, '/views/layouts/'),
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
      allowProtoPropertiesByDefault: true,
    //   hbs: allowInsecurePrototypeAccess(hbs.engine)
      
    },
  });
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs',exphbs({extname: 'hbs', defaultLayout: 'main', layoutDir: __dirname + '/views/layouts/'}));
app.set('view engine','hbs');
app.use(router);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));