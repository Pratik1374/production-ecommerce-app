import React from "react";
import Header from "./Header.js";
import Footer from "./Footer.js";
import {Helmet} from 'react-helmet';
import {ToastContainer} from 'react-toastify'; //not working
import 'react-toastify/dist/ReactToastify.css';

function Layout(props) {
  return (
    <div>
      <Helmet>
        <meta charset="UTF-8"/>
        <meta name="description" content={props.description}/>
        <meta name="keywords" content={props.keywords}/>
        <meta name="author" content={props.author}/>
        <title>{props.title}</title>
      </Helmet>
        <Header/>
        <main style={{minHeight:'70vh'}}>
          <ToastContainer/>
          {props.children}
        </main>
        <Footer />
    </div>
  );
}

Layout.defaultProps = {
  title: "myCom : Ecommerce App",
  description: "mern stack app",
  keywords: "mern stack ecommerce app",
  author: "myEcom"
}

export default Layout;
