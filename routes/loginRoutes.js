import express from "express";
import LoginController from "../controllers/loginController.js";

const router = express.Router();
const loginController = new LoginController();

router.get("/", (req, res) => loginController.loginView(req, res));
router.post("/", (req, res) => loginController.login(req, res));
router.get("/logout", (req, res) => loginController.logout(req, res));

export default router;
