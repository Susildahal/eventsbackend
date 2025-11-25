import {register, login} from "../controllers/auth.js";
import express from "express";

const userrouter = express.Router();

userrouter.post("/register", register);
userrouter.post("/login", login);

export default userrouter;