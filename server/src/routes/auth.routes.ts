import {Router } from 'express';
import {getMe,login,register} from "../controllers/auth.controller.js";
import {protect} from "../middleware/auth.js"
import {validateBody} from "../middleware/validate.js";
import {loginSchema , registerSchema} from "../validators/auth.validators.js";

const router = Router();

router.post("/register",validateBody(registerSchema),register);
router.post("/login",validateBody(loginSchema),login);
router.get("/me",protect,getMe);

export default router;