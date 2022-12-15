const mysql = require("mysql");
module.exports = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"a246987",
  port:3306,
  database:"lifeconcierge"
});

