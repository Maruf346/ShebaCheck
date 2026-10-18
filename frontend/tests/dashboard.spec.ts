import { expect, test } from "@playwright/test";

const dashboards = [
  ["/customer-dashboard", "Customer dashboard"],
  ["/provider-dashboard", "Provider dashboard"],
  ["/admin-dashboard", "Admin dashboard"],
] as const;

test("dashboards remain usable without page-width overflow", async ({ page }) => {
  for (const [path, heading] of dashboards) {
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.getByRole("navigation", { name: `${heading} navigation` })).toBeVisible();
    }
  }
});

test("customer can write a review, submit a dispute, and rebook", async ({ page }) => {
  await page.goto("/customer-dashboard");
  await page.getByRole("button", { name: "Write review" }).click();
  await page.getByLabel("Your review").fill("Clear communication and excellent service.");
  await page.getByRole("button", { name: "Submit review" }).click();
  await expect(page.getByRole("status")).toContainText("Review saved");

  await page.getByRole("button", { name: "Start a report" }).click();
  await page.getByLabel("What happened?").fill("The appointment details need follow-up from the demo team.");
  await page.getByRole("button", { name: "Send demo report" }).click();
  await expect(page.getByText("Demo report received. No case was sent to a service team.")).toBeVisible();

  await page.getByRole("button", { name: "Rebook" }).first().click();
  await expect(page).toHaveURL(/\/booking\?provider=1$/);
});

test("provider can update requests, schedule, services, and portfolio", async ({ page }) => {
  await page.goto("/provider-dashboard");
  const requestService = page.getByText("Switchboard repair");
  await page.getByRole("button", { name: "Accept" }).first().click();
  await expect(requestService.locator("..")).toContainText("Confirmed");

  await page.getByRole("button", { name: "Set unavailable dates" }).click();
  await page.getByLabel("Unavailable date").fill("2030-01-01");
  await page.getByRole("button", { name: "Add date" }).click();
  await expect(page.getByText("Unavailable · 2030-01-01")).toBeVisible();

  await page.getByRole("button", { name: "Edit details" }).click();
  await page.getByLabel("Primary service").fill("Electrical safety inspection");
  await page.getByRole("button", { name: "Save service details" }).click();
  await expect(page.getByRole("status")).toContainText("Service details saved");

  await page.getByLabel("Portfolio project description").fill("Lighting upgrade, Mirpur");
  await page.getByRole("button", { name: "Add sample" }).click();
  await expect(page.getByText("Lighting upgrade, Mirpur")).toBeVisible();
});

test("admin can mark a review case as reviewed", async ({ page }) => {
  await page.goto("/admin-dashboard");
  await page.getByRole("button", { name: "Mark reviewed" }).first().click();
  await expect(page.getByRole("button", { name: "Reviewed" }).first()).toBeDisabled();
});