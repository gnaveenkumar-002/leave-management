import { v4 as uuidv4 } from "uuid";
import { saveLeave } from "../services/dynamodb.service";

interface ApplyLeaveInput {
  fromDate: string;
  toDate: string;
  reason: string;
  empId: string;
  employeeEmail: string;
  managerEmail: string;
}

export const handler = async (event: ApplyLeaveInput) => {
  console.log("ApplyLeave input:", JSON.stringify(event));

  const { fromDate, toDate, reason, empId, employeeEmail, managerEmail } = event;

  // ---------- Basic validation ----------
  if (!fromDate || !toDate || !reason) {
    throw new Error("fromDate, toDate and reason are required");
  }

  if (!empId || !employeeEmail || !managerEmail) {
    throw new Error("Employee and manager details are missing");
  }

  // ---------- Date validation ----------
  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    throw new Error("Invalid date format. Use YYYY-MM-DD");
  }

  // Normalize dates (remove time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  if (from < today) {
    throw new Error("fromDate cannot be in the past");
  }

  if (to < today) {
    throw new Error("toDate cannot be in the past");
  }

  if (from > to) {
    throw new Error("fromDate cannot be after toDate");
  }

  // ---------- Create leave ----------
  const leaveId = uuidv4();

  const leaveItem = {
    leaveId,
    empId,
    employeeEmail,
    managerEmail,
    fromDate,
    toDate,
    reason,
    status: "PENDING",
    createdAt: new Date().toISOString()
  };

  await saveLeave(leaveItem);

  console.log("Leave saved successfully:", leaveItem);

  return leaveItem;
};
