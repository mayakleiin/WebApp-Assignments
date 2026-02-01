import request from "supertest";
import initApp from "../server";

const registerAndLogin = async (app: any, suffix: string) => {
  const email = `user${suffix}@test.com`;
  const password = "123456";

  await request(app).post("/auth/register").send({
    username: `user${suffix}`,
    email,
    password,
  });

  const loginRes = await request(app).post("/auth/login").send({
    email,
    password,
  });

  return {
    accessToken: loginRes.body.accessToken as string,
  };
};

describe("Users", () => {
  let app: any;

  beforeAll(async () => {
    app = await initApp();
  });

  it("should return users list", async () => {
    await request(app).post("/auth/register").send({
      username: "u1",
      email: "u1@test.com",
      password: "123456",
    });

    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should forbid update of another user", async () => {
    const a = await registerAndLogin(app, "A");
    const b = await registerAndLogin(app, "B");

    const usersRes = await request(app).get("/users");
    const userB = usersRes.body.find((u: any) => u.email === "userB@test.com");
    const userBId = userB.id;

    const res = await request(app)
      .put(`/users/${userBId}`)
      .set("Authorization", `Bearer ${a.accessToken}`)
      .send({ username: "hacker" });

    expect(res.statusCode).toBe(403);
  });

  it("should allow user to update self", async () => {
    const a = await registerAndLogin(app, "C");

    const usersRes = await request(app).get("/users");
    const userC = usersRes.body.find((u: any) => u.email === "userC@test.com");
    const userCId = userC.id;

    const res = await request(app)
      .put(`/users/${userCId}`)
      .set("Authorization", `Bearer ${a.accessToken}`)
      .send({ username: "newname" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username", "newname");
  });
});
