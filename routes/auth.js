import {register, login , deleteuser ,getallusers ,mee ,updatepassowrd} from "../controllers/auth.js";
import express from "express";
import { verifyToken } from "../middlewares/auth.js";

const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.get("/", verifyToken, getallusers);
userrouter.delete("/users/:id", verifyToken, deleteuser);
userrouter.get("/me", verifyToken, mee);
userrouter.put("/updatepassword/:id", verifyToken, updatepassowrd);

export default userrouter;