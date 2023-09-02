// api/product.js 
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = "mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const query = {};
    const allProducts = await inventory.find(query).toArray();
    
    // Use NextResponse to handle the response
    return NextResponse.json({ allProducts });
  } catch (error) {
    console.error('Error:', error);
    // Use NextResponse to handle the error response
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  const body = await request.json();
  const uri = "mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const product = await inventory.insertOne(body);
    
    // Use NextResponse to handle the response
    return NextResponse.json({ product, ok: true }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    // Use NextResponse to handle the error response
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  } finally {
    await client.close();
  }
}
