//api/action

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let {action, productName, initailQuantity}= await request.json();
    const uri = "mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/";
    const client = new MongoClient(uri);

    try {
        const database = client.db('stock');
        const inventory = database.collection('inventory');
        const filter = {productName : productName};

        let newQuantity = action=="plus"?(parseInt(initailQuantity)+1):(parseInt(initailQuantity)-1)
        const updateDoc = {
            $set: {
                productQuantity: newQuantity // Update the quantity field
            },
        };
        const result = await inventory.updateOne(filter,updateDoc,{});
        return NextResponse.json({ sucess: true, message :`${result.matchedCount} document(s) has matched by A-jay, updated ${result.modifiedCount} document(s)`})
    }
 
    finally {
        // Ensures that the client will close when you finish/error
        await client.close();

    }
}