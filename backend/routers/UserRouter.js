import express from 'express'
import UserController from '../controllers/UserController.js'

const router = express.Router();
const userController = new UserController();

router.get('/topusers', userController.GetTopUsers);
router.get('/:id', userController.GetUser)
router.get('/followers/:id', userController.GetFollowers);
router.get('/followees/:id', userController.GetFollowees);
router.post('/create', userController.CreateUser);
router.post('/follow', userController.FollowUser);
router.post('/unfollow', userController.UnfollowUser);
router.put('/height', userController.UpdateUserHeight);
router.delete('/:id', userController.DeleteUser);

export default router;