import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout.js";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../context/cart.js";
import { SpinnerDotted } from "spinners-react";
import { ShopOutlined,DollarCircleOutlined } from '@ant-design/icons';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cart, setCart] = useCart();

  //get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
    }
  };
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
    }
  };

  //get products count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
    }
  };

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

  //handle filters selected
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id); //if value is not checked then remove that id
    }
    setChecked(all);
  };

  //filter products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);
  return (
    <Layout title={"myEcom: Ecommerce App"}>
      {loading ? (
        <div className="d-flex justify-content-center" style={{minHeight:"70vh"}}>
        <SpinnerDotted
          size={90}
          thickness={76}
          speed={145}
          color="#36ad47"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
        </div>
      ) : (
        <div className="row my-2">
          <div className="col-md-2">
            <div className="p-2">
              <h6 className="fw-bold" style={{ marginLeft: "8px" }}>
                <ShopOutlined/> Filter By Category
              </h6>
              <div className="d-flex flex-column" style={{marginLeft:"10px"}}>
                {categories.map((c) => (
                  <Checkbox
                    key={c._id}
                    onChange={(e) => handleFilter(e.target.checked, c._id)}
                  >
                    {c.name}
                  </Checkbox>
                ))}
              </div>
              <h6 className="mt-2 fw-bold" style={{ marginLeft: "8px" }}>
               <DollarCircleOutlined/> Filter By Price
              </h6>
              <div className="d-flex flex-column" style={{marginLeft:"10px"}}>
                <Radio.Group onChange={(e) => setRadio(e.target.value)}>
                  {Prices.map((p) => (
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
            </div>
            <div className="text-center m-2">
              <button
                style={{
                  backgroundColor: "#89d8d3",
                  backgroundImage:
                    "linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%)",
                }}
                className="btn "
                onClick={() => window.location.reload()}
              >
                RESET FILTERS
              </button>
            </div>
          </div>
          <div className="col-md-10">
            <div className="d-flex ">
              <div className="d-flex flex-wrap justify-content-center">
                {products.map((p) => (
                  <div
                    className="card m-2 p-1"
                    style={{ width: "20rem", borderRadius: "20px" }}
                  >
                    <div className="text-center m-2">
                      <img
                        src={`/api/v1/product/product-image/${p._id}`}
                        className="text-center"
                        alt={p.name}
                        style={{ height: "200px", width: "200px" }}
                      />
                    </div>
                    <div className="card-body">
                      <h6 className="card-title fw-bold">{p.name}</h6>
                      <p className="card-text fw-light">
                        {p.description.substring(0, 30)}
                      </p>
                      <p className="card-text fw-bold text-success fs-6">
                        &#x20B9;{p.price}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
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
        </div>
      )}
    </Layout>
  );
};

export default Homepage;
