import { Router } from "express";
import { createUserHandler } from "../controller/user.controller";

const router = Router();

router.post('/create-user', createUserHandler);
// router.get('/get-user',)

export default router;