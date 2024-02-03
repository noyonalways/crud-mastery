import { Router } from "express";
import userRoutes from "./users";
const router: Router = Router();

router.use("/api", userRoutes);

export default router;

/**
 * User Endpoints
 * - POST /api/users
 * - GET /api/users
 * - GET /api/users/:userId
 * - PUT /api/users/:userId
 * - DELETE /api/users/:userId
 *
 * Order Endpoints
 * - PUT /api/users/:userId/orders
 * - GET /api/users/:userId/orders
 * - GET /api/users/:userId/total-price
 */
