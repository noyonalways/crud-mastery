import { Request, Response, Router } from "express";
const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).send(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>CRUD Mastery App</title>
    </head>
    <body>
      <h1>Welcome to CRUD Mastery App</h1>
    </body>
    </html>
    `
  );
});

router.get("/status", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 200,
  });
});

export default router;
