import express from 'express'
import UserController from '../controllers/UserController.js'

const router = express.Router();
const userController = new UserController();

router.post('/create', userController.CreateUser);
router.get('/:id', userController.GetUser);

export default router;