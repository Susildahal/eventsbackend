import {register, login , deleteuser ,getallusers ,mee ,updatepassowrd ,forgotpassword ,checkotp ,resetpassword ,updateuser} from "../controllers/auth.js";
import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.get("/", verifyToken, getallusers);
userrouter.delete("/:id", verifyToken, deleteuser);
userrouter.get("/me", verifyToken, mee);
userrouter.put("/updatepassword/:id", verifyToken, updatepassowrd);
userrouter.post("/forgot-password", forgotpassword);
userrouter.post("/checkotp", checkotp);
userrouter.post("/reset-password", resetpassword);
userrouter.put("/updateuser/:id", verifyToken, updateuser);


export default userrouter;