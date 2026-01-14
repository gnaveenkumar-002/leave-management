import { handler } from "../../src/notify/notify";

jest.mock("../../src/services/ses.service", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

describe("NotifyFunction", () => {
  it("should send manager approval email", async () => {
    await handler({
      type: "MANAGER",
      taskToken: "token",
      leave: {
        leaveId: "L1",
        empId: "EMP1",
        managerEmail: "manager@test.com",
        fromDate: "2026-01-20",
        toDate: "2026-01-22",
        reason: "Personal"
      }
    } as any);
  });

  it("should send employee notification email", async () => {
    await handler({
      type: "EMPLOYEE",
      leave: {
        employeeEmail: "emp@test.com",
        fromDate: "2026-01-20",
        toDate: "2026-01-22",
        status: "APPROVED"
      }
    } as any);
  });
});
it("FAIL - manager email without taskToken", async () => {
  await expect(
    handler({
      type: "MANAGER",
      leave: { managerEmail: "a@test.com" }
    } as any)
  ).rejects.toThrow("Task token is missing");
});
