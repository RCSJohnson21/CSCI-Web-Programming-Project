import React, { useState, useEffect } from 'react';
import { Menu } from "../components/Menu";
import { Footer } from "../components/Footer";

export default function Shop() {

  const [products, setProducts] = useState([]) //stores all of the product data which is retrieved from the database
  const [filter, setFilter] = useState(null) //stores the filter data. This is a string which is either null for all, or 'shirt', 'pants', 'hat', 'jersey'

  useEffect(() => {
    getProducts()
  }, []); 

  // sends a post request to the api which returns all of the products in the database
  // store all the product information in the 'products' variable within a dictionary object
  // NOTE: API route logic is saved under 'pages/api/*'
  async function getProducts() {
    // build post request object
    const res = await fetch('/api/get_products', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      }
    })
    const data = await res.json()

    // parse request and clean the data object
    let products_arr = []
    for(let p in data) {
      products_arr.push(data[p])
    }

    // store the returned information in the products variable
    console.log(products_arr)
    setProducts(products_arr)
  }

  // sends a post request to the api which updates the users cart
  // functionality for adding a product to the cart (THIS IS A WORK IN PROGRESS)
  async function addToCart(pid) {
    const res = await fetch('/api/add_to_cart', {
      method: 'POST',
      body: JSON.stringify({ pid: pid }),
      headers: {
          'Content-Type': 'application/json'
      }
    })
    const data = await res.json()
  }
  
  // changes the css to highlight which filter is selected 
  // returns the filter component
  function buildFilterComponent() {
    let all_css, shirts_css, pants_css, hat_css, jersey_css
    if (filter==null) all_css = "bg-white"; else all_css = "stegman-bg"
    if (filter=="shirt") shirts_css = "bg-white"; else shirts_css = "stegman-bg"
    if (filter=="pants") pants_css = "bg-white"; else pants_css = "stegman-bg"
    if (filter=="hat") hat_css = "bg-white"; else hat_css = "stegman-bg"
    if (filter=="jersey") jersey_css = "bg-white"; else jersey_css = "stegman-bg"
    return (
      <>
        <button className={"mx-2 hover:bg-white px-5 py-2 rounded-lg " + all_css}    onClick={() => {setFilter(null)}}>All</button>
        <button className={"mx-2 hover:bg-white px-5 py-2 rounded-lg " + shirts_css} onClick={() => {setFilter("shirt")}}>Shirts</button>
        <button className={"mx-2 hover:bg-white px-5 py-2 rounded-lg " + pants_css}             onClick={() => {setFilter("pants")}}>Pants</button>
        <button className={"mx-2 hover:bg-white px-5 py-2 rounded-lg " + hat_css}    onClick={() => {setFilter("hat")}}>Hats</button>
        <button className={"mx-2 hover:bg-white px-5 py-2 rounded-lg " + jersey_css}  onClick={() => {setFilter("jersey")}}>Jerseys</button>
      </>
    );
  }
  

  return (
    <>
      {/* Render the menu component */}
      <Menu />

      <div className="flex ">
        <div className=" mx-auto">
        <h2 className="py-5 text-center text-3xl">Products</h2>
        <div className="flex justify-center m-auto mb-5 p-5 bg-black">

          {/*The filter component*/}
          <div className="py-2 text-lg pr-2 text-white">
            Filter By: 
          </div>
          {buildFilterComponent()}
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg: lg:grid-cols-4 gap-10 justify-items-center my-5">

        {/*Make sure the products are loaded from the database before trying to display them*/}
        {products && products.length != 0
        ?
        <>
        {/*Run a foreach loop through all the products stored in the 'products' dictionary object*/}
        {products[0].map((product, index) => {
          
            if(filter==null){
              //If there is no filter applied, then display all of the products
              return (
                <div key={index} className="card m-auto">
                    <h2 className="my-2 p-5 ">{product.title}</h2>
                    <img src={product.image} />
                    <p className="price">${product.price.toFixed(2)}</p>
                    <p className="p-5 text-left odyssey-bg mb-0">{product.description}</p>
                    <p className="mb-0">
                      <button onClick={() => {addToCart(product.pid)}}>Add to Cart</button>
                    </p>
                </div>
              )
            }
            else if (filter==product.category){
              //If there is a filter applied, then only display products whose category matches the filter
              return (
                <div key={index} className="card m-auto">
                    <h2 className="my-2 p-5 ">{product.title}</h2>
                    <img src={product.image} />
                    <p className="price">${product.price.toFixed(2)}</p>
                    <p className="p-5 text-left odyssey-bg mb-0">{product.description}</p>
                    <p className="mb-0">
                      <button onClick={() => {addToCart(product.pid)}}>Add to Cart</button>
                    </p>
                </div>
              )
            }
          })}
        </>
        :
        null
        }
        </div>
        </div>
      </div>

      {/* Render the footer component */}
      <Footer />
    </>
  );
}