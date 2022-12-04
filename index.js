const {MongoClient} = require('mongodb');
const http = require('http');
const url = "mongodb+srv://Venkatateja_thokala:Teja1234@cluster0.ilvuzg9.mongodb.net/?retryWrites=true&w=majority";

const host = 'localhost';
const port = 9000;

const requestListener = async function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
    res.write(JSON.stringify(await dbClient()));
    res.end();
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

async function dbClient() {
    const client = new MongoClient(url);
    const list = await getHospitalsListing(client);
    return list;
}


async function getHospitalsListing(client) {
    var hospitalsDetails = null;
    try {
        console.log('TEJA');
        client.connect();
        const query = { state: "CT" };
        hospitalsDetails = await client.db("Hospital_Listing").collection("Hospital_Details").find(query).toArray();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
    console.log(hospitalsDetails);
    return hospitalsDetails;
}