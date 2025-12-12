import {register, login , deleteuser ,getallusers ,mee ,updatepassowrd ,forgotpassword ,checkotp ,resetpassword ,updateuser ,updateuserstatus ,profile} from "../controllers/auth.js";
import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {isAdmin} from '../middlewares/auth.js';
import upload from "../middlewares/upload.js";

const userrouter = express.Router();

userrouter.post("/register", verifyToken, isAdmin, register);
userrouter.post("/login", login);
userrouter.get("/", verifyToken, getallusers);
userrouter.delete("/:id", verifyToken, isAdmin, deleteuser);
userrouter.get("/me", verifyToken, mee);
userrouter.put("/updatepassword/:id", verifyToken, updatepassowrd);
userrouter.post("/forgot-password", forgotpassword);
userrouter.post("/checkotp", checkotp);
userrouter.post("/reset-password", resetpassword);
userrouter.put("/updateuser/:id", verifyToken, isAdmin, updateuser);
userrouter.patch("/updateuserstatus/:id", verifyToken, isAdmin, updateuserstatus);
userrouter.put("/profile/:id", verifyToken, upload.single("profilePicture"), profile);

export default userrouter;