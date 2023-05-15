import React from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
    }
  };

  //handle payment
  const handlePayment = async() => {
    try {
      document.getElementById("paymentButton").innerHTML = "Processing...";
      const {data} = await axios.post("/api/v1/auth/place-order",{cart});
      if(data?.success)
      {
        document.getElementById("paymentButton").innerHTML = "Make Payment";
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/dashboard/user/orders");
      }
    } catch (error) {
    }
  }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center p-2 mb-1" style={{color:"#d904d5"}}>
              {`Hello @${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center" style={{color:"#c29b2f"}}>
              {cart?.length
                ? `You Have ${cart.length} items in your cart ${
                    auth?.token ? "" : "please login to checkout"
                  }`
                : <h4 style={{color:"red"}}>Your Cart Is Empty</h4>}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            {cart?.map((p) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-3" style={{margin:"10px"}}>
                  <img
                    src={`/api/v1/product/product-image/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                </div>
                <div className="col-md-8">
                  <p className="fw-bold">{p.name}</p>
                  <p>{p.description.substring(0, 30)}</p>
                  <p>Price : {p.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-6 text-center">
            <h2 style={{color:"blue"}}>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4 >Total : <span style={{color:"green"}}>{totalPrice()}</span></h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                  {cart?.length > 0 ? (
                    <div className="mt-3">
                    <button className="btn btn-success" id="paymentButton" onClick={handlePayment}>Make Payment</button>
                    </div>
                  ):(
                    <></>
                  )}
                  
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <div>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                  <button className="btn btn-success" id="paymentButton" onClick={handlePayment}>Make Payment</button>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() =>
                      navigate("/login", {
                        state: "/cart",
                      })
                    }
                  >
                    Plase Login to checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;