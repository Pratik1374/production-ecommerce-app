import express from "express";
import {
  registerController,
  loginController,
  testController,
  updateProfileController,
  placeOrderController,
  getUserOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//register route
router.post("/register", registerController);

//register route
router.post("/login", loginController);

//protected route for user authentication
router.get("/user-auth",requireSignIn,(req,res)=>{
  res.status(200).send({ok:true});
})

//protected route for admin authentication
router.get("/admin-auth",requireSignIn,isAdmin,(req,res)=>{
  res.status(200).send({ok:true});
});

//update profile
router.put("/profile",requireSignIn,updateProfileController);

//make order
router.post("/place-order",requireSignIn,placeOrderController);

//get all orders of user
router.get("/orders",requireSignIn,getUserOrdersController);

//get all orders details for admin
router.get("/all-orders",requireSignIn,isAdmin,getAllOrdersController);

//get all orders details for admin
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController);

export default router;
