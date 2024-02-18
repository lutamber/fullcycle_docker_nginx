
const express = require("express");
const namesGen = require("gerador-nome");
const mysql = require("mysql");

const app = express();

const port = 3000;
const mysqlConfigs = {
    host: "db",
    database: "desafio_nginx",
    user: "root",
    password: "root"
}; 

const connection = mysql.createConnection(mysqlConfigs);

app.get("/", (req, res) => {

    try
    {
        let name = !!req.query.name ? req.query.name : namesGen.geradorNome();
    
        connection.query(`create table if not exists people (id int not null auto_increment, name varchar(255), primary key(id))`);
    
        connection.query(`INSERT INTO people (name) VALUES ('${name}')`);
        connection.query("SELECT * FROM people", function(err, result) {   
            if(!!result)
            {
                var dbNames = [];
    
                for(let i=0; i < result.length; ++i) {
                    dbNames.push(`- ${result[i].name}<br>`);
                }
    
                res.send(`<h1>Full Cycle Rocks!</h1><br>${dbNames.join('')}`);
            }
        });
    }
    catch(error)
    {
        console.log(error);
    }
});

app.get("/reset", (req, res) => {

    connection.query("DELETE FROM people");
    res.send("Data successfully deleted!")

});

app.listen(port, () => {
    console.info(`Running application on port ${port}`);
});