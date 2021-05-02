const mysql = require('promise-mysql');
const {createCache, getCache} = require("./cache")

const MYSQL_DOCKER_HOST_NAME = process.env.MYSQL_DOCKER_HOST_NAME
const DB_PASSWORD = process.env.DB_PASSWORD

const getConnection = async () => {
    return mysql.createConnection({
        host     : MYSQL_DOCKER_HOST_NAME,
        user     : 'root',
        password : DB_PASSWORD,
        database : 'animal',
        port     : 3306
    });
}

exports.insertAnimal = async (req,res) => {
    try{
        const {name, description} = req.body; 
        const conn = await getConnection(); 

        let result = await conn.query(`INSERT into animal_info values ('${name}', '${description}')`);
        
        res.send({ 
            msg : "Succesfully insert a new record",
            data : {
                name,
                description
            }
        })
    }catch(error){
        res.status(400).send({
            msg : "Error occured",
            error
        })
    }
}

exports.getAnimal = async (req,res) => {
    try{
        const {name} = req.params;
        let data, message;
        // Get cache
        data = JSON.parse(await getCache(name));
        if(data){
            message = "Result are returned from cache"
        }else{
            const conn = await getConnection();
            data = await conn.query(`SELECT * FROM animal_info WHERE name='${name}'`);
            message = "Successfully get the data from database"
            await createCache(name, data)
        }        
        res.send({
            message,
            data
        })
    }catch(error){
        console.log(error)
        res.status(400).send({
            msg : "Error occured",
            error
        })
    }
}