/**
 * Generate aws-deployment-guide.pdf from aws-deployment-guide.html
 *
 * Run from automation-tests-2.0:
 *   pnpm exec node ../playwright-reporter-backend/docs/generate-aws-deployment-pdf.mjs
 *
 * Or from playwright-reporter-backend (if @playwright/test is installed):
 *   node docs/generate-aws-deployment-pdf.mjs
 */
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "aws-deployment-guide.html");
const pdfPath = path.join(__dirname, "aws-deployment-guide.pdf");

const playwrightCandidates = [
  path.join(__dirname, "../../automation-tests-2.0/node_modules/@playwright/test/index.mjs"),
  path.join(__dirname, "../node_modules/@playwright/test/index.mjs"),
];

let chromium;
for (const candidate of playwrightCandidates) {
  try {
    ({ chromium } = await import(pathToFileURL(candidate).href));
    break;
  } catch {
    // try next
  }
}

if (!chromium) {
  console.error(
    "Could not load @playwright/test. Run from automation-tests-2.0:\n" +
      "  pnpm exec node ../playwright-reporter-backend/docs/generate-aws-deployment-pdf.mjs",
  );
  process.exit(1);
}

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle" });
await page.waitForFunction(
  () => document.querySelectorAll(".mermaid svg").length >= 4,
  { timeout: 60000 },
);

await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  margin: { top: "16mm", right: "14mm", bottom: "16mm", left: "14mm" },
});

await browser.close();
console.log(`PDF written to: ${pdfPath}`);
