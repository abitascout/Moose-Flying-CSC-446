const express = require("express");
const mysql = require("mysql2");


const app = express();

app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));
// Can only send GET&POST req. This allows for all verbs
app.use(methodOverride("_method"))

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

app.get('/login', (request, response) => {
	// Render login template
	response.send("/login")
})
app.post("/login", (req, res) => {
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password) 
  const {username, password} = req.body
  if (username && password) {
    connection.query("SELECT * FROM users WHERE username = ? AND password = ?'", [username, sha256(password)], (error, results, fields)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      }
      // If we get anything from the database
      // results object will be populated
      if ( results.length > 0) {
        // Redirect to query page
        res.status(200).redirect("/query");
      } else {
        res.send("Invalid credentials")
      }
    });
  } else {
    res.send("Invalid entry.")
  }
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
