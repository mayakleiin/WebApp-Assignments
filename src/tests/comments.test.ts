import request from "supertest";
import initApp from "../server";

const registerAndLogin = async (app: any, suffix: string) => {
  await request(app).post("/auth/register").send({
    username: `user${suffix}`,
    email: `user${suffix}@test.com`,
    password: "123456",
  });

  const loginRes = await request(app).post("/auth/login").send({
    email: `user${suffix}@test.com`,
    password: "123456",
  });

  return loginRes.body.accessToken as string;
};

describe("Comments", () => {
  let app: any;

  beforeAll(async () => {
    app = await initApp();
  });

  it("should block creating comment without token", async () => {
    const res = await request(app).post("/comments").send({
      postId: "123",
      content: "hi",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should create comment with token", async () => {
    const token = await registerAndLogin(app, "1");

    const postRes = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "T", content: "C" });

    const postId = postRes.body._id;

    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({ postId, content: "Nice!" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });
});
