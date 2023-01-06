const express = require("express");
const mysql = require("mysql2");
const app = express();
const sha256 = require('crypto-js/sha256');
const { request, response } = require("express");


app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));

const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);
const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);

let dbConnection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});


app.get("/query", (request, response) =>  {
  const SQL = "SELECT * FROM users;"
  dbConnection.query(SQL, [true], (error, results, fields) => {
    if (error) {
      console.error(error.message)
      response.status(500).send("database error")
    } else {
      console.log(results)
      response.send(results)
    }
  });
})

// Home Page
app.get('/', (request, response) => {
	// Render login template
	response.send("index.html");
});

// LOGIN ROUTE
// Only username & password
app.post("/login", (request, response) => {
  const log = "SELECT *FROM users WHERE username = ? AND password = ?;"
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password) 
  const {username, password} = request.body
  const hashPassword = sha256(password)
  if (username && password) {
    dbConnection.query(log,[String(username), String(hashPassword)], (error, results)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
        return
      }
      // If we get anything from the database
      // results object will be populated
      console.log(results)
      if (results.length > 0) {
        // Redirect to query page
        console.log(results.username)
        response.status(200).redirect("query.html");
        return
      } else {
        console.log(results)
        response.status(401).redirect("/")
        return
      }
    });
  } else {
    response.send("Invalid entry.")
  }
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
