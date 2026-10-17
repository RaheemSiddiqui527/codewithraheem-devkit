// Verify root import
import {
  chunk,
  unique,
  pick,
  capitalize,
  clamp,
  sleep,
  safeJsonParse,
  normalizeError,
  daysBetween,
} from "@codewithraheem/devkit";

// Verify subpath imports
import { partition } from "@codewithraheem/devkit/array";
import { getPath } from "@codewithraheem/devkit/object";
import { toCamelCase } from "@codewithraheem/devkit/string";
import { roundTo } from "@codewithraheem/devkit/number";
import { retry } from "@codewithraheem/devkit/async";
import { isEmail } from "@codewithraheem/devkit/validation";
import { getErrorMessage } from "@codewithraheem/devkit/error";
import { startOfDay } from "@codewithraheem/devkit/date";

console.log("Testing ESM consumer imports...");

// 1. Array
const chunks = chunk([1, 2, 3, 4, 5], 2);
console.log("Chunk:", chunks);
if (chunks.length !== 3) throw new Error("Chunk failed");

const [evens, odds] = partition([1, 2, 3, 4], (x) => x % 2 === 0);
console.log("Partition:", { evens, odds });

// 2. Object
const user = { name: "Raheem", role: "Engineer", company: "DevKit" };
const picked = pick(user, ["name", "role"]);
console.log("Pick:", picked);
const name = getPath(user, "name");
console.log("GetPath:", name);

// 3. String
console.log("Capitalize:", capitalize("learn build innovate"));
console.log("CamelCase:", toCamelCase("learn-build-innovate"));

// 4. Number
console.log("Clamp:", clamp(15, 0, 10));
console.log("RoundTo:", roundTo(1.005, 2));

// 5. Validation
console.log("IsEmail:", isEmail("raheem@example.com"));
const parseRes = safeJsonParse('{"ok": true}');
console.log("SafeJsonParse:", parseRes);

// 6. Error
const errMsg = getErrorMessage(new Error("Database connection lost"));
console.log("GetErrorMessage:", errMsg);

// 7. Date
const days = daysBetween(new Date(2025, 0, 1), new Date(2025, 0, 10));
console.log("DaysBetween:", days);
if (days !== 9) throw new Error("DaysBetween calculation failed");

// 8. Async
await sleep(10);
const retryRes = await retry(async () => "retry-success", { retries: 1 });
console.log("Retry result:", retryRes);

console.log("✅ All ESM consumer checks passed successfully!");
