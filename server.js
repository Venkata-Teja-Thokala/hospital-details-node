// include all external modules that exists in seperate files 
const {MongoClient} = require('mongodb'); 
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
// mongodburl for connectivity
const mongourl = "mongodb+srv://Venkatateja_thokala:Teja1234@cluster0.ilvuzg9.mongodb.net/?retryWrites=true&w=majority";

// whatever is in the environment variable PORT, or 3000 if there's nothing there.
const port = process.env.port || 9000;

// create server function using http.createServer
const server = http.createServer(async (request, response) =>{
    // if end points contains about
    console.log('Teja');
    if(request.url === '/about') {
        // load index.html from public folder available
        fs.readFile(path.join(__dirname, 'public','index.html'), (err, data) =>{
            // if err throw error
            if(err) 
                throw err;
            // set writeHead with 200 and content-Type as text html
            response.writeHead(200, {'content-Type':'text/html'});
            // set data to response end
            response.end(data);
        })
    } else if(request.url === '/api') {
        // load db.json if url 
        fs.readFile(path.join(__dirname, '','db.json'), (err, data) =>{
            if(err) throw err;
            // set writeHead with 200 and content-Type as text html
            response.writeHead(200, {'content-Type':'application/json'});
            // set data to response end
            response.end(data);
        })
    } else if(request.url.includes("/hospitalDetails")){
        // get query parameter
        const queryObject = url.parse(request.url, true).query;
        // set contentType as aplication/json and access control to allow origin
        response.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
        // set hospital details
        response.write(JSON.stringify(await getHospitaldetails(queryObject)));
        // response.end()
        response.end();
    } else {
        // response with error
        response.end( "Wrong Url. Please check.");
    }
});

// call listen function 
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// a fucntion to create MongoClient using mongoURL
async function getHospitaldetails(query) {
    // create mongoClient object
    const client = new MongoClient(mongourl);
    // call getHospitalListing object
    const list = await getHospitalsListing(client, query);
    // return list;
    return list;
}

//function getHospitalsListing
async function getHospitalsListing(client, query) {
    // create a variable 
    let hospitalsDetails = null;
    try {
        // connect to mongo db
        client.connect();
        // call load data from mongo db
        hospitalsDetails = await client.db("Hospital_Listing").collection("Hospital_Details").find(query).toArray();
    } catch (e) {
        // catch any error
        console.error(e);
    } finally {
        // close mongo connection
        await client.close();
    }
    // return hospital details to caller function
    return hospitalsDetails;
}