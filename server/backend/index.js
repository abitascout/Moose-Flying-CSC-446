const express = require("express");
const mysql = require("mysql2");
const SHA256 = require("crypto-js/sha256");




const app = express();
app.use(express.json());
app.use("/", express.static("frontend"));

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
  const logging = "INSERT INTO logs(username,password,attemp,sessionTime) VALUES ?;"
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
        const token = jwt.sign(roles, ACCESS_TOKEN, {expiresIn: '10s'});
        //save(ACCESS_TOKEN)
        const obj = {
          v1: token,
          v2: ACCESS_TOKEN,
          v3: user
        }
        const searchParams = new URLSearchParams(obj);
        const queryString = searchParams.toString();
        let values = [String(username), String(hashPassword),String("Success"),String("10s")];
        connection.query(logging, [values], (err,rows) => {
          if(err) console.log(err);
          console.log("Logged.")
        });
        response.status(200).redirect("query.html?" + queryString);
        return
      } else {
        let values = [String(username), String(hashPassword),"Failed","10s"]
        connection.query(logging, [values], (err,rows) => {
          if(err)throw err;
          console.log("Logged.")
        });
        response.status(401).redirect("/")
        return
      }
    });
  } else {
    let values = [String(username), String(hashPassword),"Failed","10s"]
    connection.query(logging, [values], (err,rows) => {
      if(err)throw err;
      console.log("Logged.")
    });
    response.send("Invalid entry.")
  }
});

app.post("/query", (request, response) => 
{
  const income = request.body.token;
  const acc = request.body.acc;
  const user = request.body.user
  const itStatement = "SELECT * FROM logs;"
  const usrStatement = "SELECT * FROM users WHERE username = ?"
  
  try{
    var casing;
    var varib = true
    var payload = jwt.verify(income, acc)
    console.log(payload.role)
    switch(payload){
      case "IT":
        casing = itStatement;
        break;
      case "Manager":
        casing = SQL;
        break;
      default:
        casing = usrStatement;
        varib = user;
        break;
    }    
    connection.query(casing, [varib], (error, results, fields) => {
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
