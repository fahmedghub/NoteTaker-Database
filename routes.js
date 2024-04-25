const express = require('express');
const router = express.Router();
const db = require('./database'); // Import SQLite3 database

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.username) {
    res.redirect('/login');
  } else {
    next();
  }
};

// Login route
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check credentials (you should hash passwords in a real application)
  if (username && password) {
    // Check if the user exists in the database
    // If not, register the new user
    // Here, you should implement the actual database logic
    // and hash the passwords for security
    db.all('SELECT COUNT(*) as count FROM users WHERE username = ? AND password = ?', [username, password], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.redirect('/login')
      }
      if (rows[0].count > 0){
        
        db.all('SELECT admin FROM users WHERE username = ? AND password = ?', [username, password], (err, rows) => {
          
          if (err){

            console.error(err.message)
          }

          else if (rows[0].admin == 1){
            
            req.session.username = username;
            req.session.admin = 1;
            res.redirect('/main_admin')
            
            console.log("user is an admin");
          }
          else{

            req.session.admin = 0;

            req.session.username = username;
            res.redirect('/main');
          }
        })
      }
      else{

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
          if (err) {
    
            console.error(err.message);
            res.redirect('/login');
          }
          else{
    
            req.session.username = username;
            res.redirect('/main');
          }
    
        });
      }
    });
  }
  
  else {
    res.redirect('/login');
  }
}
);

// Main page route
router.get('/main', requireLogin, (req, res) => {
  const username = req.session.username;

  // Retrieve user data from the database
  // Here, you should implement the actual database logic
  // to fetch the data associated with the current user
  db.all('SELECT data FROM user_data WHERE username = ?', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.render('main', { title: 'Main Page', user_data: rows });
  });
});

//Admin main page route
router.get('/main_admin', requireLogin, (req, res) => {
  const username = req.session.username;

  // Retrieve user data from the database
  // Here, you should implement the actual database logic
  // to fetch the data associated with the current user
  db.all('SELECT data FROM user_data WHERE username = ?', [username], (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.render('main_admin', { title: 'Notes', user_data: rows });
  });

  // db.all('SELECT date, todo FROM user_todo WHERE username = ?', [username], (err, rows) => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  //   res.render('main_admin', { title: 'Todo', user_data: rows });
  // });
});

// Save data route
router.post('/save', requireLogin, (req, res) => {
  const username = req.session.username;
  const data = req.body.data;
  const is_admin = req.session.admin;

  // Save data to the database
  // Here, you should implement the actual database logic
  db.run('INSERT INTO user_data (username, data) VALUES (?, ?)', [username, data], (err) => {
    if (err) {
      console.error(err.message);
    }
    if (is_admin == 1){
      
      res.redirect('/main_admin');
    }
    else{
      
      res.redirect('/main');
    }
  });
});

// // Save todo-list route
// router.post('/save-todo', requireLogin, (req, res) => {
//   const username = req.session.username;
//   const data = req.body.data;
//   const is_admin = req.session.admin;

//   // Save data to the database
//   // Here, you should implement the actual database logic
//   db.run('INSERT INTO user_todo (username, date, todo) VALUES (?, DATE("now"), ?)', [username, data], (err) => {
//     if (err) {
//       console.error(err.message);
//     }
//     if (is_admin == 1){
      
//       res.redirect('/main_admin');
//     }
//     else{
      
//       res.redirect('/main');
//     }
//   });
// });

// Users List route
router.get('/users', requireLogin, (req, res) => {

  db.all('SELECT id, username, "hidden" as "password_hidden", admin from users', (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.render('users', { title: 'Users List', user_list: rows });
  });
});

// Logout route
router.get('/logout', (req, res) => {
  // Destroy the session and redirect to the login page
  req.session.destroy((err) => {
    if (err) {
      console.error(err.message);
    }
    res.redirect('/login');
  });
});

module.exports = router;
