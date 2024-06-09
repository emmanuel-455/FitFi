import express from "express"
import { loginUser, signupUser } from "../controller/userController.js"

const router = express.Router()

//Login Router
router.post("/login", (loginUser))

//Signup Router
router.post("/signup", (signupUser))

export default router

