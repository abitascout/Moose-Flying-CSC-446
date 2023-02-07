const express = require("express");
const mysql = require("mysql2");
const app = express();
const sha256 = require("bcryptjs");
const crypt = require("crypto-js");
const salt = '$2a$04$ZBcpPXMSGuV0CFmqO4ncDe';
const jwt = require('jsonwebtoken');
const { response } = require("express");
const { stat } = require("fs");

app.use(express.json());
app.use("/", express.static("frontend"));
app.use(express.urlencoded({ extended: true }));

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

// rounds to the nearset 30 seconds
function roundToNearestSeconds(date) {
  const minutes = .5
  const ms = 1000 * 60 * minutes;
  let times = new Date(Math.ceil(date.getTime() / ms) * ms)
  return times;
}

// generates the access code
function checking(){
  var key = "monkey";
  let date = new Date();
  let date2 = roundToNearestSeconds(date).toTimeString().slice(0,9);
  var compare = key+=date2;
  var hashes = crypt.SHA256(compare).toString(crypt.Hex);

  var counter = 0;
  var digits= "";
  while(counter < 6)
  {   
      for(var x = 0; x < hashes.length; x++){
          var can = Number(hashes[x]);
          if(0 <= can <= 9 && !isNaN(can)){
                  digits +=String(hashes[x]);
                  counter += 1;
          }
          if(counter == 6){
              break;
          }
      }
  return digits;
}
}

app.get('/', (request, response) => {
	// Render login template
	response.send("index.html");
});


app.post("/login", async function (request, response){
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

    const rows = await connection.promise().query(log,[String(username), String(hashPassword)], (error, results)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      }
    });
    if(rows[0][0] != null )
    {
      if (rows[0][0].username == username && rows[0][0].password == hashPassword){
        attempts = "Success"
        status = 200
      }
      else{
        attempts = "Failure"
        status = 401
      }
    }
    else{
      attempts = "Failure"
      status = 401
    }
    
    
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
      console.log("Login Logged")
    }
  });

  //grabbing the latest logId
  var grabbing = "SELECT MAX(logId) as id FROM logs"
  connection.query(grabbing, [true], (error, results) =>{
    if(error){
      console.log(error.message)
    }
    else{
      logId = results[0].id

      if(status == 200)
      {
        obj = {
          v1:logId
          }
        const searchParams = new URLSearchParams(obj);
        const queryString = searchParams.toString();
        // change query to acces page once access page is made
        response.status(status).redirect("/access.html?" + queryString); 
      }
      else{
        response.status(status).redirect("/")
      }
        }
  });
  
});

// this is the query route and based on the users role get the appropriate information
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
        
          if(params == 2){
            casing = itStatement;
            connection.query(casing, [true], (error, results) => {
              if (error) {
                console.error(error.message)
                response.status(500).send("database error")
              } else {
                response.send(results)
              }
            });}
          else if(params != 1){
            response.status(401).end()
          }
          else{
            casing = usrStatement
            var w = String(user);
            connection.query(casing, [w], (error, results) => {
              if (error) {
                console.error(error.message)
                response.status(500).send("database error")
              } else {
                response.send(results)
              }
            });
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
              response.send(results)
            }
          });}
          else if(params == 2){
            casing = itStatement;
            connection.query(casing, [true], (error, results) => {
              if (error) {
                console.error(error.message)
                response.status(500).send("database error")
              } else {
                response.send(results)
              }
            });
           }
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
              response.send(results)
            }
          });
          }
          else{
            response.send("Access Denied")
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
// checks user inputed access token with our access token
app.post("/checking", async function (request, response) {
  
  var checks = await checking();
  const id = request.body.logId
  const inn = request.body.input
  var gotIn 
  var searchParams
  var status2
  //checks the logs and users table for the common username between both  based on log id
  const checkLogs = "Select * from logs INNER JOIN users ON logs.username=users.username WHERE logid = ?;"
  const dataLogs = await connection.promise().query(checkLogs, [String(id)], (error, results) => {
    if(error){
      console.log(error.message)
      console.status(500).send("database error")
    }
    else{     
    }
  });

  const check = dataLogs[0][0].loginAttemp
  switch(check){
    case("Success"):
        // if the login was a success and the access token matches ours then generate the jwt token
        if (checks == inn){
          const roles = {role: dataLogs[0][0].role}
          const user = dataLogs[0][0].username
          const ACCESS_TOKEN = require('crypto').randomBytes(64).toString('hex');
          const token = jwt.sign(roles, ACCESS_TOKEN, {expiresIn: "10s"});
          let obj = {
            v1: token,
            v2: ACCESS_TOKEN,
            v3: user
          }
          searchParams = new URLSearchParams(obj)
          gotIn = "Success"
        }
        else
        {
          gotIn = "Failed"
          status2 = 401
        }
        break;
      default:
        gotIn = "Failed"
        status2 = 402
        break;
  }



  //updates the log table with the accessAttemp either failed or success
  var inserting = "UPDATE logs  SET accessAttemp = ? WHERE logId = ?;"
  //logs the attemp in log table
  connection.query(inserting, [String(gotIn), id], (error, results) =>{
    if(error){
      console.log(error.message)
    }
    else
    {
      if (check != null){
        if(gotIn == "Success"){
          //send the nessary info to the query page
          queryString = searchParams.toString()
          console.log("Logged updated")
          response.status(200).send("/query.html?" + queryString);
          return
          
        }
        else if (gotIn == "Failed")
        {
          if(status2 == 402){
          // this is the failed login error handled to redirect them to the login page
          //response.send("Failed Login Attemp Sending to Login page.")
          return response.status(402).send("/")}
          else
          {
            //this is the entered wrong access code hadler.
            return response.sendStatus(401)
          }
        }
        
    }
      }
      
    
  });


});

app.post("/comments", (request, response) =>{
  var commentSql = "INSERT INTO submitedComments (Comm) VALUES (?)"
  const message = request.body.comment
  console.log(message)
  connection.query(commentSql, [String(message)], (error, results) =>{
    if(error){
      console.log(error.message)
      response.status(500).send("database error")
    }
    else{   
      response.status(200).redirect("/Blog.html")
    }
  });
});

app.get("/getComments", async function (request, response){
  var comm = "SELECT Comm FROM submitedComments;"
  const con = await connection.promise().query(comm, [true], (error,results) => {
    if(error){
      console.log(error)
    }
    else{
      console.log(results)
    }
  });
  if(con[0] != null ){
    var obj = {
      v1: con[0]
    }
    var temp = JSON.stringify(obj)
    response.send(temp)
  }
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
