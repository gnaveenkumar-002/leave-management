const sendMock = jest.fn();

jest.mock("@aws-sdk/client-sfn", () => {
  return {
    SFNClient: jest.fn(() => ({
      send: (...args: any[]) => sendMock(...args),
    })),
    SendTaskSuccessCommand: jest.fn(),
    SendTaskFailureCommand: jest.fn(),
  };
});

jest.mock("../../src/services/dynamodb.service", () => ({
  updateLeaveStatus: jest.fn().mockResolvedValue(true),
}));

import { handler } from "../../src/handlers/approve";

describe("ApproveFunction", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it("SUCCESS – approve leave", async () => {
    sendMock.mockResolvedValueOnce({});

    const res = await handler({
      queryStringParameters: {
        action: "approve",
        token: "task-token",
        leaveId: "leave-123",
      },
    } as any);

    expect(res.statusCode).toBe(200);
  });

  it("SUCCESS – reject leave", async () => {
    sendMock.mockResolvedValueOnce({});

    const res = await handler({
      queryStringParameters: {
        action: "reject",
        token: "task-token",
        leaveId: "leave-123",
      },
    } as any);

    expect(res.statusCode).toBe(200);
  });

  it("FAIL – missing params", async () => {
    const res = await handler({} as any);
    expect(res.statusCode).toBe(400);
  });

  it("FAIL – Step Function throws error", async () => {
    sendMock.mockRejectedValueOnce(new Error("boom"));

    const res = await handler({
      queryStringParameters: {
        action: "approve",
        token: "task-token",
        leaveId: "leave-123",
      },
    } as any);

    expect(res.statusCode).toBe(500);
  });
});
