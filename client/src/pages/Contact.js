import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout title={"Contact - myEcom"}>
      <div className="contact-container">
        <div className="contactus">
            <h1 style={{backgroundColor:"rgb(164, 248, 128)",textAlign:"center",borderRadius:"20px",marginBottom:"30px"}}>CONTACT US</h1>
            <p>For any query you can contact us at any time</p>
            <p className="mt-3">
              <BiMailSend /> : www.help@ecommerceapp.com
            </p>
            <p className="mt-3">
              <BiPhoneCall /> : 000-0000000
            </p>
            <p className="mt-3">
              <BiSupport /> : 1800-0000-0000 (toll free)
            </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
