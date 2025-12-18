
import express from "express";
import { submitContactForm , getAllContacts , getContactById , deleteContact ,patchContactStatus ,deleteBulkContacts } from "../controllers/contactus.js";
import { verifyToken } from "../middlewares/auth.js";
const contractrouter = express.Router();

contractrouter.post("/", submitContactForm);
contractrouter.get("/", getAllContacts);
contractrouter.get("/:id", getContactById);
contractrouter.delete("/:id", deleteContact);
contractrouter.patch("/:id", patchContactStatus);
contractrouter.post("/delete-bulk", verifyToken, deleteBulkContacts);

export default contractrouter;