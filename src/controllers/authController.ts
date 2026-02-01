import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import userModel from "../models/userModel";

const mustGetEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, mustGetEnv("ACCESS_TOKEN_SECRET"), {
    expiresIn: mustGetEnv(
      "ACCESS_TOKEN_EXPIRES_IN",
    ) as jwt.SignOptions["expiresIn"],
  });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, mustGetEnv("REFRESH_TOKEN_SECRET"), {
    expiresIn: mustGetEnv(
      "REFRESH_TOKEN_EXPIRES_IN",
    ) as jwt.SignOptions["expiresIn"],
  });
};

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ error: "Missing fields" });
  }

  const existing = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (existing) {
    return res.status(409).send({ error: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    passwordHash,
  });

  res.status(201).send({
    id: user._id,
    username: user.username,
    email: user.email,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshTokens.push(refreshToken);
  await user.save();

  res.send({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).send({ error: "Missing refresh token" });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { userId: string };

    const user = await userModel.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(403).send({ error: "Invalid refresh token" });
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    res.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch {
    res.status(403).send({ error: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.sendStatus(204);
  }

  const user = await userModel.findOne({
    refreshTokens: refreshToken,
  });

  if (user) {
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
    await user.save();
  }

  res.sendStatus(204);
};
