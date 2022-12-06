const {MongoClient} = require('mongodb');
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const mongourl = "mongodb+srv://Venkatateja_thokala:Teja1234@cluster0.ilvuzg9.mongodb.net/?retryWrites=true&w=majority";

const host = 'localhost';
const port = 9000;

const requestListener = async function (req, res) {
    if(req.url === '/about') {
        res.writeHead(200, {'Content-Type':'text/html'});
        fs.readFile(path.join(__dirname, 'public','index.html'), (err, data) =>{
            if(err) throw err;
            res.writeHead(200, {'content-Type':'text/html'});
            res.end(data);
        })
    } else if(req.url === '/api') {
        fs.readFile(path.join(__dirname, '','db.json'), (err, data) =>{
            if(err) throw err;
            res.writeHead(200, {'content-Type':'application/json'});
            res.end(data);
        })
    } else {
        const queryObject = url.parse(req.url, true).query;
        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
        res.write(JSON.stringify(await dbClient(queryObject)));
        res.end();
    }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

async function dbClient(query) {
    const client = new MongoClient(mongourl);
    const list = await getHospitalsListing(client, query);
    return list;
}


async function getHospitalsListing(client, query) {
    var hospitalsDetails = null;
    try {
        console.log('TEJA');
        client.connect();
       // const query = { state: "CT" };
        hospitalsDetails = await client.db("Hospital_Listing").collection("Hospital_Details").find(query).toArray();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    //console.log(hospitalsDetails);
    return hospitalsDetails;
}