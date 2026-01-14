import { handler } from "../../src/auth/login";
beforeAll(() => {
  process.env.JWT_SECRET = "test-secret";
});


describe("Login Handler", () => {
  test("SUCCESS - returns token with default role", async () => {
    const res = await handler({
      body: JSON.stringify({
        empId: "EMP1",
        email: "emp@test.com",
      }),
    } as any);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).token).toBeDefined();
  });

  test("SUCCESS - returns token with custom role", async () => {
    const res = await handler({
      body: JSON.stringify({
        empId: "EMP1",
        email: "emp@test.com",
        role: "MANAGER",
      }),
    } as any);

    expect(res.statusCode).toBe(200);
  });

  test("FAIL - missing empId", async () => {
    const res = await handler({
      body: JSON.stringify({
        email: "emp@test.com",
      }),
    } as any);

    expect(res.statusCode).toBe(400);
  });

  test("FAIL - missing email", async () => {
    const res = await handler({
      body: JSON.stringify({
        empId: "EMP1",
      }),
    } as any);

    expect(res.statusCode).toBe(400);
  });

  test("FAIL - empty body", async () => {
    const res = await handler({
      body: "{}",
    } as any);

    expect(res.statusCode).toBe(400);
  });
});
it("FAIL - missing empId", async () => {
  const res = await handler({
    body: JSON.stringify({ email: "a@test.com" }),
  });

  expect(res.statusCode).toBe(400);
});

it("FAIL - missing email", async () => {
  const res = await handler({
    body: JSON.stringify({ empId: "EMP1" }),
  });

  expect(res.statusCode).toBe(400);
});

it("FAIL - missing empId and email", async () => {
  const res = await handler({
    body: JSON.stringify({}),
  });

  expect(res.statusCode).toBe(400);
});
it("FAILURE - missing empId", async () => {
  const event = {
    body: JSON.stringify({ email: "a@test.com" })
  };

  const res = await handler(event as any);

  expect(res.statusCode).toBe(400);
});
