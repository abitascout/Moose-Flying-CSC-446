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

function roundToNearestSeconds(date) {
  const minutes = .5
  const ms = 1000 * 60 * minutes;
  let times = new Date(Math.ceil(date.getTime() / ms) * ms)
  return times;
}

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
                  console.log(can);
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

    const rows = await connection.query(log,[String(username), String(hashPassword)], (error, results)=> {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      }
      // If we get anything from the database
      // results object will be populated
      if (results.length > 0) {
        attempts = "Success"
        console.log(81)
        console.log(attempts)
        status = 200
        //response.status(200).redirect("query.html?" + queryString);
      } else {
        attempts = "Failure"
        //response.status(401).redirect("/")
        status = 401
      }
    });
    console.log(rows)
  } 
  else {
    attempts = "Failure"
    response.send("Invalid entry.")
  }
  var inserting = "INSERT INTO logs (username, password, loginAttemp, sessionTime) VALUES ( ?, ?, ?, '10s');"
  //logs the attemp in log table
  console.log(14)
  console.log(attempts)
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
        response.status(status).redirect("access.html?" + queryString); 
      }
      else{
        response.status(status).redirect("/")
      }
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
  
app.post("/checking", async function (request, response) {
  
  var checks = await checking();
  const id = request.body.logId
  const inn = request.body.inputs
  var gotIn 
  var searchParams
  var status2
  const checkLogs = "Select * from logs where logid = ?;"
  connection.query(checkLogs, [String(id)], (error, results) => {
    if(error){
      console.log(error.message)
      console.status(500).send("database error")
    }
    else{
      const check = {check : results[0].attempts}
      console.log(21)
      console.log(check)
      switch(check){
        case("Success"):
            if (checks == inn){
              const roles = {role: results[0].role}
              const user = results[0].username
              const ACCESS_TOKEN = require('crypto').randomBytes(64).toString('hex');
              const token = jwt.sign(roles, ACCESS_TOKEN, {expiresIn: '10s'});
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
      
    }
  });

  var inserting = "UPDATE logs  SET accessAttemp = ? WHERE logId = ?;"
  //logs the attemp in log table
  connection.query(inserting, [String(gotIn), id], (error, results) =>{
    if(error){
      console.log(error.message)
    }
    else
    {
      console.log("Logged")
    }
    if(gotIn == "Success"){
      queryString = searchParams.toString()
      response.status(200).redirect("query.html?" + queryString);
    }
    else if (gotIn == "Failed")
    {
      if(status2 = 402){
      response.send("Failed Login Attemp Sending to Login page.")
      response.status(402).redirect("/").end()}
      else
      {
        response.status(401)
      }
    }
  });


});



app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
