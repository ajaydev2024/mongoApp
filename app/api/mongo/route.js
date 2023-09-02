import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {

    const uri = "mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/";

    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const movies = database.collection('inventory');

        // Query for a movie that has the title 'Back to the Future'
        const query = {};
        const movie = await movies.find(query).toArray();
        console.log(movie);
        return NextResponse.json({ "a": 546 })
    } 
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();

    }
}