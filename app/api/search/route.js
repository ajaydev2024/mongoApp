// api/search
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const queryParam = request.nextUrl.searchParams.get("query");
  console.log(queryParam);
  const uri = "mongodb+srv://ssnc-Inventory:jIorzSeWzo3CETeA@cluster0.dd3cywd.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const Product = await inventory.aggregate([{
      $match: {
        $or: [
          { productName: { $regex: queryParam, $options: 'i' } },
        ]
      }
    }
    ]).toArray()

    // Use NextResponse to handle the response
    return NextResponse.json({ success: true, Product });
  } catch (error) {
    console.error('Error:', error);
    // Use NextResponse to handle the error response
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  } finally {
    await client.close();
  }
}
