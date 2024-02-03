import userController from "./../controllers/users";
import { Router } from "express";
const router: Router = Router();

router
  .route("/users")
  .post(() => {})
  .get(userController.getUser);

router
  .route("/users/:userId")
  .get(() => {})
  .put(() => {})
  .delete(() => {});

router
  .route("/users/:userId/orders")
  .put(() => {})
  .get(() => {});

router.route("/users/:userId/total-price").get(() => {});
export default router;