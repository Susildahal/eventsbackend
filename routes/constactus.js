import {} from "../controllers/contactus.js";
import express from "express";
import { submitContactForm , getAllContacts , getContactById , deleteContact ,patchContactStatus} from "../controllers/contactus.js";
const contractrouter = express.Router();

contractrouter.post("/", submitContactForm);
contractrouter.get("/", getAllContacts);
contractrouter.get("/:id", getContactById);
contractrouter.delete("/:id", deleteContact);
contractrouter.patch("/:id", patchContactStatus);
export default contractrouter;