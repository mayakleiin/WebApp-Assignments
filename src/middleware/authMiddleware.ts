import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type JwtPayload = {
  userId: string;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "Unauthorized: missing Authorization header" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!token || !["JWT", "Bearer"].includes(scheme)) {
    return res
      .status(401)
      .send({ error: "Unauthorized: invalid Authorization format" });
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return res
      .status(500)
      .send({ error: "Server misconfigured: missing ACCESS_TOKEN_SECRET" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded?.userId) {
      return res
        .status(401)
        .send({ error: "Unauthorized: invalid token payload" });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch {
    return res
      .status(401)
      .send({ error: "Unauthorized: invalid or expired token" });
  }
};
