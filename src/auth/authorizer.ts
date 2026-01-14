import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "leave-management-secret-123";

export const handler = async (event: any) => {
  try {
    const token = event.authorizationToken?.replace("Bearer ", "");
    if (!token) {
      throw new Error("No token");
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    return {
      principalId: decoded.empId || "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: event.methodArn
          }
        ]
      },
      context: {
        empId: decoded.empId,
        email: decoded.email,
        role: decoded.role
      }
    };
  } catch (err) {
    return {
      principalId: "unauthorized",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: event.methodArn
          }
        ]
      }
    };
  }
};
