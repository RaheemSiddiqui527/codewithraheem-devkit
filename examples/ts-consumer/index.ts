import {
  chunk,
  unique,
  groupBy,
  partition,
  pick,
  omit,
  safeJsonParse,
  clamp,
  sleep,
  daysBetween,
} from "@codewithraheem/devkit";

import { compact } from "@codewithraheem/devkit/array";
import { getPath } from "@codewithraheem/devkit/object";
import { capitalize } from "@codewithraheem/devkit/string";
import { roundTo } from "@codewithraheem/devkit/number";

// 1. Verify array type inference
const numbers: number[] = [1, 2, 3, 4, 5];
const chunked: number[][] = chunk(numbers, 2);
const uniq: number[] = unique(numbers);
const grouped: Record<string, number[]> = groupBy(numbers, (n) =>
  n % 2 === 0 ? "even" : "odd"
);
const [truthy, falsy]: [number[], number[]] = partition(
  numbers,
  (n) => n > 2
);
const compacted: number[] = compact([1, 0, 2, false, 3, null]);

// 2. Verify object type inference
interface User {
  id: string;
  name: string;
  age: number;
}
const user: User = { id: "1", name: "Raheem", age: 30 };
const picked: Pick<User, "name" | "id"> = pick(user, ["name", "id"]);
const omitted: Omit<User, "age"> = omit(user, ["age"]);
const userAge: number = getPath<number>(user, "age", 0);

// 3. Verify string & number type inference
const cap: string = capitalize("test");
const rounded: number = roundTo(clamp(1.234, 0, 5), 2);

// 4. Verify discriminated union inference
interface Payload {
  status: "active" | "inactive";
}
const result = safeJsonParse<Payload>('{"status": "active"}');
if (result.success) {
  const status: "active" | "inactive" = result.data.status;
  console.log("Status:", status);
} else {
  const err: Error = result.error;
  console.error("Parse error:", err.message);
}

// 5. Verify async & date
await sleep(10);
const days: number = daysBetween(new Date(), new Date());

console.log({
  chunked,
  uniq,
  grouped,
  truthy,
  falsy,
  compacted,
  picked,
  omitted,
  userAge,
  cap,
  rounded,
  days,
});
