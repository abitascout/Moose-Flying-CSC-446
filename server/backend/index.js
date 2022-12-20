const express = require("express");
const mysql = require("mysql2");
const app = express();
const sha256 = require('crypto-js/sha256');


app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));


const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);


const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);
const SQL = "SELECT * FROM users;"

let connection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});



app.get("/query", (request, response) =>  {
  connection.query(SQL, [true], (error, results, fields) => {
    if (error) {
      console.error(error.message)
      response.status(500).send("database error")
    } else {
      console.log(results)
      response.send(results)
    }
  });
})

app.get('/', (request, response) => {
	// Render login template
	response.send("index.html");
});


app.post("/login", async (request, response) => {
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password) 
  const {username, password} = request.body
  const hashPassword = sha256(password)
  if (username && password) {
    connection.query("SELECT * FROM users WHERE username = ? AND password = ?'", [username, hashPassword], (error, results, fields)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      }
      // If we get anything from the database
      // results object will be populated
      if ( results.length > 0) {
        // Redirect to query page
        response.status(200).redirect("/query");
      } else {
        response.status(401).redirect("/login")
      }
    });
  } else {
    response.send("Invalid entry.")
  }
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
