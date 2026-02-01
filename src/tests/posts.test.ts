import request from "supertest";
import initApp from "../server";

const registerAndLogin = async (app: any, suffix: string) => {
  await request(app)
    .post("/auth/register")
    .send({
      username: `user${suffix}`,
      email: `user${suffix}@test.com`,
      password: "123456",
    });

  const loginRes = await request(app)
    .post("/auth/login")
    .send({
      email: `user${suffix}@test.com`,
      password: "123456",
    });

  return loginRes.body.accessToken as string;
};

describe("Posts", () => {
  let app: any;

  beforeAll(async () => {
    app = await initApp();
  });

  it("should block create post without token", async () => {
    const res = await request(app).post("/post").send({
      title: "t",
      content: "c",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should create post with token", async () => {
    const token = await registerAndLogin(app, "1");

    const res = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Hello", content: "World" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("title", "Hello");
  });

  it("should forbid update by another user", async () => {
    const tokenA = await registerAndLogin(app, "A");
    const tokenB = await registerAndLogin(app, "B");

    const createRes = await request(app)
      .post("/post")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Mine", content: "Post" });

    const postId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/post/${postId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Hacked", content: "Nope" });

    expect(updateRes.statusCode).toBe(403);
  });
});
