"use client"
import React, { useEffect, useState } from 'react';

const Page = () => {
  const [productForm, setproductForm] = useState({})
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([])
  const [alert, setAlert] = useState();
  const [loadingAction, setloadingAction] = useState(false)
  const [loading, setLoading] = useState(false);
  const [dropdown, setDropdown] = useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/product')
      let rjson = await response.json();
      setProducts(rjson.allProducts);
    }
    fetchProducts()
  }, [])

  const buttonAction = async (action, productName, initailQuantity) => {
    let index = products.findIndex((item) => item.productName == productName)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {
      newProducts[index].productQuantity = parseInt(initailQuantity) + 1
      console.log(newProducts[index].productQuantity)
    }
    else {
      newProducts[index].productQuantity = parseInt(initailQuantity) - 1
    }
    setProducts(newProducts) 

    let indexDrop = dropdown.findIndex((item) => item.productName == productName)
    let newDropDown = JSON.parse(JSON.stringify(dropdown))
    console.log(indexDrop,"pasre ",newDropDown)

    if (action == "plus") {
      newDropDown[indexDrop].productQuantity = parseInt(initailQuantity) + 1
      console.log(newDropDown[indexDrop].productQuantity)
    }
    else {
      newDropDown[indexDrop].productQuantity = parseInt(initailQuantity) - 1
    }
    setDropdown(newDropDown)
    setloadingAction(true)

    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, productName, initailQuantity })
    });
    let r = await response.json();
    console.log("Action Button : ", r)
    setloadingAction(false);

  }

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });
      if (response.ok) {

        setAlert("Your Product has been Added !")
        setproductForm({})
      }
      else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
    const response = await fetch('/api/product')
    let rjson = await response.json();
    setProducts(rjson.allProducts);

  };

  const handleChange = (e) => {
    setproductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    let inputValue = e.target.value;
    setQuery(inputValue);
    if (query.length > 2) {
      setLoading(true); 
      setDropdown([]);
      const response = await fetch('/api/search?query=' + query); // Use inputValue instead of query
      let data = await response.json();
      setDropdown(data.Product);
      setLoading(false);
    }
  };


  return (
    <>
      <div className="container mx-auto p-4 bg-red-50">
        <h1 className="text-3xl font-semibold mb-4 text-center">Current Stock</h1>
        <div className='text-green-600 text-center'>{alert}</div>
        <div className="m-4 flex">
          <input
            type="text"
            id="productSearch"
            name='productSearch'
            // onBlur={()=>{setDropdown([])}}
            onChange={onDropdownEdit}
            placeholder="Search by product name"
            className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-400"
          />
        </div>
        {loading && <div className='flex'>
          <svg fill="#fff" width="140" height="64" viewBox="0 0 140 64" xmlns="http://www.w3.org/2000/svg"></svg> </div>}
        <div className='dropContainer absolute w-[2wh] bg-purple-200'>
          {dropdown && dropdown.map(item => {
            return (
              <div key={item._id} className='flex justify-between  p-2 my-1 border-b-2'>
                <span className="border p-2">{item.productName} ({item.productQuantity} available for ${item.productPrice}) </span>
                <div className="mx-5">
                  <button onClick={() => { buttonAction("minus", item.productName,item.productQuantity) }} disabled={loadingAction} className="subtract inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white rounded-lg border p-2 disabled:bg-slate-300">-</button>
                  <span className="inline-block min-w-3 mx-3 border p-2">{item.productQuantity}</span>
                  <button onClick={() => { buttonAction("plus", item.productName,item.productQuantity) }} disabled={loadingAction}
                    className="add inline-block px-3 py-1 cursor-pointer bg-purple-500 text-white rounded-lg border p-2 disabled:bg-slate-300">+</button>
                </div>
              </div>
            );  
          })}


        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="productName" className="block font-medium">
                Product Name:
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={productForm?.productName || ""}
                id="productName"
                name="productName"
                required
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productPrice" className="block font-medium">
                Price:
              </label>
              <input
                type="number"
                onChange={handleChange}
                id="productPrice"
                value={productForm?.productPrice || ""}
                name="productPrice"
                step="0.01"
                required
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="productQuantity" className="block font-medium">
                Quantity:
              </label>
              <input
                type="number"
                onChange={handleChange}
                id="productQuantity"
                value={productForm?.productQuantity || ""}
                name="productQuantity"
                required
                className="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <button
                onClick={addProduct}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>

        <div className="m-6">
          <h2 className="text-xl font-semibold mb-4">Stock Data</h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map(item => (
                <tr key={item._id}>
                  <td className="border p-2">{item.productName}</td>
                  <td className="border p-2">${item.productPrice}</td>
                  <td className="border p-2">{item.productQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Page;
