// app.engine('handlebars',  Handlebars.engine({ defaultLayout: `${__dirname}\\views\\layout`}));
const express = require('express');
const exphbs = require('hbs');
const sqlite3 = require('sqlite3');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Use sessions for tracking login status
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Use Handlebars as the view engine
// app.engine('hbs', exphbs.engine({ layoutsDir: 'views', extname: '.hbs' }));
app.set('view engine', 'hbs');

// Serve static files
app.use(express.static('public'));

// Parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));

// SQLite3 database setup
const db = new sqlite3.Database('./database.db');

// Routes
app.get('/', (req, res) => {

  if(req.session.username){

    if (req.session.admin == 1){

      res.redirect('/main_admin')
    }
    else{

      res.redirect('/main');
    }
  }
  else{

    res.redirect('/login');
  }
});

app.use('/', require('./routes')); // Update this line


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

