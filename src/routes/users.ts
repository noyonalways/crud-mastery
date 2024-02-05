import { addOrder, getOrders, getTotalPrice } from "../controllers/orders";
import * as userController from "./../controllers/users";
import { Router } from "express";
const router: Router = Router();

router
  .route("/users")
  .post(userController.createUser)
  .get(userController.getUsers);

router.route("/users/:userId/orders").put(addOrder).get(getOrders);

router
  .route("/users/:userId")
  .get(userController.getUserByProperty)
  .put(userController.updateUserInfoPut)
  .delete(userController.deleteUserByUserId);

router.route("/users/:userId/total-price").get(getTotalPrice);
export default router;
