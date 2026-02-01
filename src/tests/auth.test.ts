import request from "supertest";
import initApp from "../server";

describe("Auth", () => {
  let app: any;

  beforeAll(async () => {
    app = await initApp();
  });

  it("should register a user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "maya",
      email: "maya@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("email", "maya@test.com");
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("should login and return tokens", async () => {
    await request(app).post("/auth/register").send({
      username: "maya",
      email: "maya@test.com",
      password: "123456",
    });

    const res = await request(app).post("/auth/login").send({
      email: "maya@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
  });

  it("should refresh tokens", async () => {
    await request(app).post("/auth/register").send({
      username: "maya",
      email: "maya@test.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "maya@test.com",
      password: "123456",
    });

    const refreshRes = await request(app).post("/auth/refresh").send({
      refreshToken: loginRes.body.refreshToken,
    });

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body).toHaveProperty("accessToken");
    expect(refreshRes.body).toHaveProperty("refreshToken");
  });

  it("should logout and invalidate refresh token", async () => {
    await request(app).post("/auth/register").send({
      username: "maya",
      email: "maya@test.com",
      password: "123456",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "maya@test.com",
      password: "123456",
    });

    const logoutRes = await request(app).post("/auth/logout").send({
      refreshToken: loginRes.body.refreshToken,
    });
    expect([200, 204]).toContain(logoutRes.statusCode);

    const refreshAfterLogout = await request(app).post("/auth/refresh").send({
      refreshToken: loginRes.body.refreshToken,
    });

    expect(refreshAfterLogout.statusCode).toBe(403);
  });
});
