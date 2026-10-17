// Verify CommonJS root require
const {
  chunk,
  unique,
  pick,
  capitalize,
  clamp,
  sleep,
  safeJsonParse,
  normalizeError,
  daysBetween,
} = require("@codewithraheem/devkit");

// Verify CommonJS subpath requires
const { partition } = require("@codewithraheem/devkit/array");
const { getPath } = require("@codewithraheem/devkit/object");
const { toSnakeCase } = require("@codewithraheem/devkit/string");
const { roundTo } = require("@codewithraheem/devkit/number");
const { isUUID } = require("@codewithraheem/devkit/validation");
const { isErrorLike } = require("@codewithraheem/devkit/error");
const { isValidDate } = require("@codewithraheem/devkit/date");

async function run() {
  console.log("Testing CommonJS consumer requires...");

  // 1. Array
  const chunks = chunk(["a", "b", "c", "d"], 2);
  console.log("Chunk:", chunks);
  if (chunks.length !== 2) throw new Error("Chunk failed in CJS");

  const [evens, odds] = partition([10, 11, 12, 13], (x) => x % 2 === 0);
  console.log("Partition:", { evens, odds });

  // 2. Object
  const picked = pick({ x: 10, y: 20, z: 30 }, ["x", "z"]);
  console.log("Pick:", picked);
  const nested = getPath({ a: { b: { c: "found" } } }, "a.b.c");
  console.log("GetPath:", nested);

  // 3. String
  console.log("Capitalize:", capitalize("welcome to commonjs"));
  console.log("SnakeCase:", toSnakeCase("welcomeToCommonJS"));

  // 4. Number
  console.log("Clamp:", clamp(50, 0, 25));
  console.log("RoundTo:", roundTo(9.999, 2));

  // 5. Validation
  const uuid = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
  console.log("IsUUID:", isUUID(uuid, 4));
  const parseRes = safeJsonParse('{"status": "ok"}');
  console.log("SafeJsonParse:", parseRes);

  // 6. Error
  console.log("IsErrorLike:", isErrorLike(new Error("Sample")));

  // 7. Date
  console.log("IsValidDate:", isValidDate(new Date()));
  console.log(
    "DaysBetween:",
    daysBetween(new Date(2025, 5, 1), new Date(2025, 5, 20))
  );

  // 8. Async
  await sleep(10);

  console.log("✅ All CommonJS consumer checks passed successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
