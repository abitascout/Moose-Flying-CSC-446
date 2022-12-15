const express = require("express");
const mysql = require("mysql2");


const app = express();
app.use(express.json());
app.use("/", express.static("frontend"));

const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);


const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);
const SQL = "SELECT * FROM users;"
const login = "SELECT username, password FROM users;"


let connection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});



app.get("/query", function (request, response) {
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

app.get("/login", function (request, response) {
  connection.query(login, [true], (error, results, fields)=> {
    if (error) {
      console.error(error.message)
      response.status(500).send("database error")
    } else {
      console.log(results)
      response.send(results)
    }
  });
})


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
