import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SpinnerDotted } from "spinners-react";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useCart();

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  //get product details
  const getProduct = async () => {
    try {
      //setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      //setLoading(false);
      getRelatedProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
    }
  };

  //get related products
  const getRelatedProducts = async (pid, cid) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
      setLoading(false);
    } catch (error) {
    }
  };

  return (
    <Layout>
      {loading ? (
        <div
          className="d-flex justify-content-center"
          style={{ minHeight: "70vh" }}
        >
          <SpinnerDotted
            size={90}
            thickness={76}
            speed={145}
            color="#36ad47"
            secondaryColor="rgba(0, 0, 0, 0.44)"
          />
        </div>
      ) : (
        <>
          <div className="row container mt-3">
            <div className="col-md-6 text-center">
              <img
                src={`/api/v1/product/product-image/${product?._id}`}
                className="card-img-top h-80"
                alt={product?.name}
                style={{ maxHeight: "300px", maxWidth: "300px" }}
              />
            </div>
            <div className="col-md-6 ">
              <h1 className="text-center" style={{color:"#2900bd"}}>Product Details</h1>
              <h6>
                <span style={{ fontWeight: "bold" }}>Name : </span>
                {product?.name}
              </h6>
              <h6>
                <span style={{ fontWeight: "bold" }}>Description : </span>
                {product?.description}
              </h6>
              <h6>
                <span style={{ fontWeight: "bold" }}>Price : </span>
                {product?.price}
              </h6>
              <h6>
                <span style={{ fontWeight: "bold" }}>Category : </span>
                {product?.category.name}
              </h6>
              <button
                className="btn btn-addToCart ms-1"
                onClick={() => {
                  setCart([...cart, product]);
                  localStorage.setItem("cart", JSON.stringify([...cart, product]));
                  toast.success("Item added to the cart");
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
          <div className="row mt-3 p-4">
            <h5 style={{color:"#359902"}}>Similar Products : </h5>
            {relatedProducts.length < 1 && (
              <p className="text-center">No similar products found</p>
            )}
            {relatedProducts?.map((p) => (
              <div className="card m-2 p-1" style={{ width: "18rem" }}>
                <img
                  src={`/api/v1/product/product-image/${p._id}`}
                  alt={p.name}
                  style={{ maxHeight: "200px" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 30)}</p>
                  <p className="card-text">&#x20B9;{p.price}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    className="btn btn-addToCart ms-1"
                    onClick={() => {
                      setCart([...cart, product]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, product])
                      );
                      toast.success("Item added to the cart");
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
};

export default ProductDetails;
