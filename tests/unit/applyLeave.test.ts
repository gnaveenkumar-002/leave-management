import { handler } from "../../src/handlers/applyLeave";

jest.mock("../../src/services/dynamodb.service", () => ({
  saveLeave: jest.fn().mockResolvedValue(true),
}));

describe("ApplyLeaveFunction", () => {
  it("should create leave successfully", async () => {
    const event = {
      fromDate: "2026-01-20",
      toDate: "2026-01-22",
      reason: "Personal",
      empId: "EMP101",
      employeeEmail: "emp@test.com",
      managerEmail: "manager@test.com"
    };
    const result = await handler(event as any);

    expect(result.leaveId).toBeDefined();
    expect(result.status).toBe("PENDING");
  });

  it("should fail when dates are invalid", async () => {
    await expect(
      handler({
        fromDate: "invalid",
        toDate: "2026-01-22",
        reason: "Test",
        empId: "EMP1",
        employeeEmail: "a@test.com",
        managerEmail: "b@test.com"
      } as any)
    ).rejects.toThrow();
  });
});
it("FAIL - missing required fields", async () => {
  await expect(
    handler({ empId: "E1" } as any)
  ).rejects.toThrow("fromDate, toDate and reason are required");
});

it("FAIL - fromDate in the past", async () => {
  await expect(
    handler({
      fromDate: "2020-01-01",
      toDate: "2026-01-01",
      reason: "Test",
      empId: "EMP1",
      employeeEmail: "a@test.com",
      managerEmail: "b@test.com"
    } as any)
  ).rejects.toThrow("fromDate cannot be in the past");
});

it("FAIL - fromDate after toDate", async () => {
  await expect(
    handler({
      fromDate: "2036-02-01",
      toDate: "2036-01-01",
      reason: "Test",
      empId: "EMP1",
      employeeEmail: "a@test.com",
      managerEmail: "b@test.com"
    } as any)
  ).rejects.toThrow("fromDate cannot be after toDate");
});

it("FAIL -fromDate after toDate", async () => {
  await expect(
    handler({
      fromDate: "2035-02-01",
      toDate: "2035-01-01",
      reason: "Test",
      empId: "EMP1",
      employeeEmail: "a@test.com",
      managerEmail: "b@test.com"
    } as any)
  ).rejects.toThrow("fromDate cannot be after toDate");
});
