import { createHmac, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node db/hash-password.ts <password>");
  process.exit(1);
}
const salt = createHmac("sha256", Math.random().toString()).digest("hex").slice(0, 32);
const key = scryptSync(password, salt, 32).toString("hex");
console.log(`scrypt$${salt}$${key}`);
