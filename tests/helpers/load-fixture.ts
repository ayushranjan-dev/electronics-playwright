import fs from "node:fs";
import path from "node:path";

export function loadJsonFixture(name: string): string {
  const p = path.join(__dirname, "../../fixtures/api", name);
  return fs.readFileSync(p, "utf-8");
}
