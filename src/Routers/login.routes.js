import {Router} from "express"
import {postLogin} from "../Controllers/login.Controller.js"

const router = Router()

router.post("/login", postLogin);

export default router;