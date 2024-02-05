import { addOrder } from "../controllers/orders";
import * as userController from "./../controllers/users";
import { Router } from "express";
const router: Router = Router();

router
  .route("/users")
  .post(userController.createUser)
  .get(userController.getUsers);

router
  .route("/users/:userId/orders")
  .put(addOrder)
  .get(() => {});

router
  .route("/users/:userId")
  .get(userController.getUserByProperty)
  .put(userController.updateUserInfoPut)
  .delete(userController.deleteUserByUserId);

router.route("/users/:userId/total-price").get(() => {});
export default router;
