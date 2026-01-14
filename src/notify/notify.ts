import { sendEmail } from "../services/ses.service";

interface NotifyEvent {
  type: "MANAGER" | "EMPLOYEE";
  leave: any;
  taskToken?: string;
}

export const handler = async (event: NotifyEvent) => {
  console.log("Notify event:", JSON.stringify(event));

  const { type, leave, taskToken } = event;

  // ---------------- MANAGER EMAIL ----------------
  if (type === "MANAGER") {
    if (!taskToken) {
      throw new Error("Task token is missing");
    }

    const approveUrl =
      `${process.env.APPROVE_URL}?action=approve` +
      `&token=${encodeURIComponent(taskToken)}` +
      `&leaveId=${leave.leaveId}`;

    const rejectUrl =
      `${process.env.APPROVE_URL}?action=reject` +
      `&token=${encodeURIComponent(taskToken)}` +
      `&leaveId=${leave.leaveId}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 6px;">
    
    <h2 style="color: #333;">Leave Approval Required</h2>

    <p><strong>Employee ID:</strong> ${leave.empId}</p>
    <p><strong>From:</strong> ${leave.fromDate}</p>
    <p><strong>To:</strong> ${leave.toDate}</p>
    <p><strong>Reason:</strong> ${leave.reason}</p>

    <div style="margin-top: 30px; text-align: center;">
      
      <a href="${approveUrl}"
         style="background-color: #28a745;
                color: #ffffff;
                padding: 12px 24px;
                margin-right: 10px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                display: inline-block;">
        Approve
      </a>

      <a href="${rejectUrl}"
         style="background-color: #dc3545;
                color: #ffffff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                display: inline-block;">
        Reject
      </a>

    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #777;">
      This is an automated email. Please do not reply.
    </p>

  </div>
</body>
</html>
`;

    await sendEmail({
      to: leave.managerEmail,
      subject: "Leave Approval Required",
      htmlBody: htmlBody
    });
  }

  // ---------------- EMPLOYEE EMAIL ----------------
  if (type === "EMPLOYEE") {
    const htmlBody = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 6px;">
    <h2 style="color: #333;">Leave Status Update</h2>
    <p>Your leave request has been <strong>${leave.status}</strong>.</p>
    <p><strong>From:</strong> ${leave.fromDate}</p>
    <p><strong>To:</strong> ${leave.toDate}</p>
  </div>
</body>
</html>
`;

    await sendEmail({
      to: leave.employeeEmail,
      subject: "Leave Status Update",
      htmlBody: htmlBody
    });
  }

  return leave;
};
