import jwt from "jsonwebtoken";

export const handler = async (event: any) => {
  const { empId, email, role } = JSON.parse(event.body || "{}");

  if (!empId || !email) {
    return {
      statusCode: 400,
      body: "empId and email are required"
    };
  }

  const token = jwt.sign(
    {
      empId,
      email,
      role: role || "EMPLOYEE"
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h"
    }
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      token
    })
  };
};
