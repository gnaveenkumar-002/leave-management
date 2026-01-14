import {
  SFNClient,
  SendTaskSuccessCommand,
  SendTaskFailureCommand
} from "@aws-sdk/client-sfn";
import { updateLeaveStatus } from "../services/dynamodb.service";

const sfnClient = new SFNClient({});

export const handler = async (event: any) => {
  console.log("Approve callback event:", JSON.stringify(event));

  const params = event.queryStringParameters || {};
  const { action, token, leaveId } = params;

  if (!action || !token || !leaveId) {
    return {
      statusCode: 400,
      body: "Missing action, token, or leaveId"
    };
  }

  try {
    // ---------- APPROVE ----------
    if (action === "approve") {
      await updateLeaveStatus(leaveId, "APPROVED");

      await sfnClient.send(
        new SendTaskSuccessCommand({
          taskToken: token,
          output: JSON.stringify({
            status: "APPROVED",
            leaveId
          })
        })
      );
    }

    // ---------- REJECT ----------
    if (action === "reject") {
      await updateLeaveStatus(leaveId, "REJECTED");

      await sfnClient.send(
        new SendTaskFailureCommand({
          taskToken: token,
          error: "REJECTED",
          cause: "Leave rejected by manager"
        })
      );
    }

    return {
      statusCode: 200,
      body: `Leave ${action}ed successfully`
    };
  } catch (error) {
    console.error("Approval error:", error);

    return {
      statusCode: 500,
      body: "Failed to process approval"
    };
  }
};
