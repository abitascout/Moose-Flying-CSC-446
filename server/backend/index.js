const express = require("express");
const mysql = require("mysql2");
const app = express();
const sha256 = require("bcryptjs");
const salt = '$2a$04$ZBcpPXMSGuV0CFmqO4ncDe';
const jwt = require('jsonwebtoken');
const { response } = require("express");






app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));


var access
const PORT = String(process.env.PORT);
const HOST = String(process.env.HOST);


const MYSQLHOST = String(process.env.MYSQLHOST);
const MYSQLUSER = String(process.env.MYSQLUSER);
const MYSQLPASS = String(process.env.MYSQLPASS);
const SQL = "SELECT * FROM users;"
const log = "SELECT * FROM users WHERE username = ? AND password = ?;"
var attempts 

var connection = mysql.createConnection({
  host: MYSQLHOST,
  user: MYSQLUSER,
  password: MYSQLPASS,
  database: "users"
});





app.get('/', (request, response) => {
	// Render login template
	response.send("index.html");
});

function save(x){
    attempts = x
}

app.post("/login", (request, response) =>{
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
      }
      // If we get anything from the database
      // results object will be populated
      if (results.length > 0) {
        const user = results[0].username
        const ACCESS_TOKEN = require('crypto').randomBytes(64).toString('hex');
        const roles = {role: results[0].role}
        // Redirect to query page
        const token = jwt.sign(roles, ACCESS_TOKEN, {expiresIn: '10s'});
        //save(ACCESS_TOKEN)
        const obj = {
          v1: token,
          V2: ACCESS_TOKEN,
          v3: user
        }
        const searchParams = new URLSearchParams(obj);
        const queryString = searchParams.toString();
        console.log(81)
        save("Success")
        response.status(200).redirect("query.html?" + queryString);
      } else {
        console.log(85)
        save("Failure")
        response.status(401).redirect("/")
      }
    });
  } 
  else {
    console.log(92)
    save("Failure")
    response.send("Invalid entry.")
  }
  var inserting = "INSERT INTO logs (username, password, attemp, sessionTime) VALUES ( ?, ?, ?, '10s');"
  connection.query(inserting, [String(username), String(hashPassword), String(attempts)], (error, results) =>{
    if(error){
      console.log(error.message)
    }
    else
    {
      console.log("Logged")
    }
  });
});

app.post("/query", (request, response) => 
{
  const income = request.body.token;
  const acc = request.body.acc;
  const user = request.body.user;
  const params = request.body.params
  const itStatement = "SELECT * FROM logs;"
  const usrStatement = "SELECT * FROM users WHERE username = ?"
  
  try{
    var casing;
    var varib = true
    var payload = jwt.verify(income, acc)
    switch(String(payload.role)){
      case "IT":
        casing = itStatement;
          if(params == 2){
            connection.query(casing, [true], (error, results) => {
              if (error) {
                console.error(error.message)
                response.status(500).send("database error")
              } else {
                console.log(results)
                response.send(results)
              }
            });}
          else{
            response.status(401).end()
          }
        break;
      case "Manager":
        if(params == 1){
          casing = SQL;
          connection.query(casing, [true], (error, results) => {
            if (error) {
              console.error(error.message)
              response.status(500).send("database error")
            } else {
              console.log(results)
              response.send(results)
            }
          });}
          else{
            response.status(401).end()
          }
        break;
      default:
        casing = usrStatement;
        varib = false;
        var w = String(user);
        if(params == 1){
          connection.query(casing, [w], (error, results) => {
            if (error) {
              console.error(error.message)
              response.status(500).send("database error")
            } else {
              console.log(results)
              response.send(results)
            }
          });}
        else{
            response.status(401).end()
          }
        break;
    }      
    
    
  }
  catch(e)
  {
    if(e instanceof jwt.JsonWebTokenError){
        return response.status(401).end()
        
    }
  }
  
});
  
  



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
