import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { SpinnerDotted } from "spinners-react";

const CategoryProducts = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [cart, setCart] = useCart();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //get products of particular category
  const getProductsByCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `/api/v1/product/category-products/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
      setLoading(false);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (params?.slug) getProductsByCategory();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more products
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      setLoading(false);
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
          <h3 className="text-center">
            Category : <span style={{ color: "green" }}>{category?.name}</span>
          </h3>
          <div className="row">
            <div className="d-flex flex-wrap">
              {products.map((p) => (
                <div className="card m-2 p-1" style={{ width: "16rem" }}>
                  <div className="text-center m-2">
                    <img
                      src={`/api/v1/product/product-image/${p._id}`}
                      className="text-center"
                      alt={p.name}
                      style={{ height: "200px", width: "200px" }}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 20)}
                    </p>
                    <p className="card-text">&#x20B9; {p.price}</p>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      className="btn btn-moreDetails ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-addToCart ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
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
            <div className="m-2 p-2">
              {products && products.length < total && (
                <div className="text-center">
                  <button
                    className="btn btn-warning"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(page + 1);
                    }}
                  >
                    {loading ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default CategoryProducts;
