const express = require("express");
const mysql = require("mysql2");
const app = express();
const sha256 = require("bcryptjs");
const salt = '$2a$04$ZBcpPXMSGuV0CFmqO4ncDe';
const jwt = require('jsonwebtoken');






app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));


const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);


const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);
const SQL = "SELECT * FROM users;"
const log = "SELECT *FROM users WHERE username = ? AND password = ?;"

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


app.post("/login", (request, response) => {
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password) 
  const username = request.body.username
  const password = request.body.password
  const hashPassword = sha256.hashSync(password,salt)
  if (username && password) {
    connection.query(log,[String(username), String(hashPassword)], (error, results)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
        return
      }
      // If we get anything from the database
      // results object will be populated
      if (results.length > 0) {
        const user = {name: results[0].username}
        const ACCESS_TOKEN = require('crypto').randomBytes(64).toString('hex');
        const roles = {role: results[0].role}
        // Redirect to query page
        const token = jwt.sign(user, ACCESS_TOKEN, {expiresIn:"30s"});
        response.status(200).redirect("query.html").json();
        return
      } else {
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
