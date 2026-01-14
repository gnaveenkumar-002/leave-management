import jwt from "jsonwebtoken";
import { handler } from "../../src/auth/authorizer";

const methodArn =
  "arn:aws:execute-api:ap-south-1:123456789012:api-id/prod/GET/resource";

describe("JWT Authorizer", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("ALLOW - valid token with empId", async () => {
    const token = jwt.sign(
      { empId: "EMP1", email: "emp@test.com", role: "EMPLOYEE" },
      "leave-management-secret-123"
    );

    const res = await handler({
      authorizationToken: `Bearer ${token}`,
      methodArn,
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe("Allow");
    expect(res.context?.empId).toBe("EMP1");
  });

  test("ALLOW - valid token without empId (fallback user)", async () => {
    const token = jwt.sign(
      { email: "emp@test.com" },
      "leave-management-secret-123"
    );

    const res = await handler({
      authorizationToken: `Bearer ${token}`,
      methodArn,
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe("Allow");
    expect(res.principalId).toBe("user");
  });

  test("DENY - missing token", async () => {
    const res = await handler({
      authorizationToken: "",
      methodArn,
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe("Deny");
  });

  test("DENY - invalid token", async () => {
    const res = await handler({
      authorizationToken: "Bearer invalid.token",
      methodArn,
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe("Deny");
  });

  test("DENY - jwt.verify throws error", async () => {
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("JWT error");
    });

    const res = await handler({
      authorizationToken: "Bearer faketoken",
      methodArn,
    } as any);

    expect(res.policyDocument.Statement[0].Effect).toBe("Deny");
  });
});
it("DENY - missing authorizationToken", async () => {
  const res = await handler({
    methodArn: "arn:test",
  });

  expect(res.policyDocument.Statement[0].Effect).toBe("Deny");
});

it("DENY - invalid token", async () => {
  const res = await handler({
    authorizationToken: "Bearer invalid.token.here",
    methodArn: "arn:test",
  });

  expect(res.policyDocument.Statement[0].Effect).toBe("Deny");
});

it("DENY - malformed header", async () => {
  const token = jwt.sign({ empId: "EMP1" }, "wrong-secret");

  const res = await handler({
    authorizationToken: token, //  no Bearer
    methodArn: "arn:test",
  });

  expect(res.policyDocument.Statement[0].Effect).toBe("Deny");
});
