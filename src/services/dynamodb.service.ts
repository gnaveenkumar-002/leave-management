import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

// DynamoDB table name from env
const TABLE_NAME = process.env.LEAVE_TABLE!;


//  Save new leave request
export const saveLeave = async (leave: any) => {
  await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: leave
    })
  );
};

// Update leave status after approval / rejection
export const updateLeaveStatus = async (
  leaveId: string,
  status: "APPROVED" | "REJECTED"
) => {
  await client.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { leaveId },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status"
      },
      ExpressionAttributeValues: {
        ":status": status
      }
    })
  );
};
