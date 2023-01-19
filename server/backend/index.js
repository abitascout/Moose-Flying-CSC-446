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


app.post("/login", async (request, response) => {
  // Capture the input fields from the index.html
  // Reference the name of the input to capture(username, password) 
  const {username, password} = request.body
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
        const user = results[0].username
        const ACCESS_TOKEN = require('crypto').randomBytes(64).toString('hex');
        const roles = {role: results[0].role}
        // Redirect to query page
        const token = jwt.sign(roles, ACCESS_TOKEN, { expiresIn: '10s' });
        //save(ACCESS_TOKEN)
        const obj = {
          v1: token,
          V2: ACCESS_TOKEN,
          v3: user
        }
        const searchParams = new URLSearchParams(obj);
        const queryString = searchParams.toString();
        response.status(200).redirect("query.html?" + queryString);
        return
      } else {
        response.status(401).redirect("/")
        return
      }
    });
  } else {
    response.send("Invalid entry.")
  }
  var inserting = "INSERT INTO logs (username, password, attempts, sessionTime) VALUES ( ?, ?, ?, '10s');"
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
  const accessToken = request.body.token;
  const secret = request.body.acc;
  
  try{
    var casing;
    var payload = jwt.verify(accessToken, secret)
    switch(String(payload.role)){
      case "IT":
        casing = itStatement;
        break;
      case "Manager":
        casing = SQL;
        break;
      default:
        casing = usrStatement;
        varib = String(user);
        break;
    }
    connection.query(casing, [varib], (error, results) => {
      if (error) {
        console.error(error.message)
        response.status(500).send("database error")
      } else {
        console.log(results)
        response.send(results)
      }
    });
           
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
