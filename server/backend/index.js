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



app.post("/login", (request, response) =>{
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password) 
  const username = request.body.username
  const password = request.body.password
  const hashPassword = sha256.hashSync(password,salt)
  var status
  var attempts
  var obj
  var logId
  
  if (username && password) {
      connection.query(log,[String(username), String(hashPassword)], (error, results)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      }
      // If we get anything from the database
      // results object will be populated
      if (results.length > 0) {
        attempts = "Success"
        status = 200
        //response.status(200).redirect("query.html?" + queryString);
      } else {
        attempts = "Failure"
        //response.status(401).redirect("/")
        status = 401
      }
    });
  } 
  else {
    attempts = "Failure"
    response.send("Invalid entry.")
  }
  var inserting = "INSERT INTO logs (username, password, loginAttemp, sessionTime) VALUES ( ?, ?, ?, '10s');"
  //logs the attemp in log table
  connection.query(inserting, [String(username), String(hashPassword), String(attempts)], (error, results) =>{
    if(error){
      console.log(error.message)
    }
    else
    {
      console.log("Logged")
    }
  });

  //grabbing the latest logId
  var grabbing = "SELECT MAX(logId) FROM logs"
  connection.query(grabbing, [true], (error, results) =>{
    if(error){
      console.log(error.message)
    }
    else{
      logId = results[0].logId
    }
  });
  if(status == 200)
  {
    obj = {
      v1:logId
    }
    const searchParams = new URLSearchParams(obj);
    const queryString = searchParams.toString();
    // change query to acces page once access page is made
    response.status(status).redirect("query.html?" + queryString); 
  }
  else{
    response.status(status).redirect("/")
  }
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
          else if(params != 1){
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
          connection.query(casing, [w], (error, results) => {
            if (error) {
              console.error(error.message)
              response.status(500).send("database error")
            } else {
              console.log(results)
              response.send(results)
            }
          });
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
  
app.post("/checking", (request, response) =>{

  // moving stuff here not currently working on it right now
  const roles = {role: results[0].role}
  const ACCESS_TOKEN = require('crypto').randomBytes(64).toString('hex');
  const token = jwt.sign(roles, ACCESS_TOKEN, {expiresIn: '10s'});
  


});



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
