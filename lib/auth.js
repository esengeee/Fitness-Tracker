import jwt from "jsonwebtoken";

export function verifyToken(req) {
  console.log("request", req)
  const authHeader = req.headers.get("authorization");
  console.log("authheader", authHeader);
  if (!authHeader) throw new Error("No token provided");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Invalid token format");

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
}
