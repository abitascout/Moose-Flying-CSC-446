const express = require("express");
const mysql = require("mysql2");
const path = require("path")


const app = express();

app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));


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
	response.sendFile(path.join(__dirname + '/index.html'));
});

app.post("/auth", (req, res) => {
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password)
  let username = req.body.username
  let password = req.body.password
  if (username && password) {
    connection.query("SELECT username, password FROM accounts WHERE username = ? AND password = ?'", [username, sha256(password)], (error, results, fields)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      }
      // If we get anything from the database
      // results object will be populated
      if ( results.length > 0) {
        // Redirect to query page
        res.redirect("/query");
      } else {
        res.send("Invalid credentials")
      }
    });
  }
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
