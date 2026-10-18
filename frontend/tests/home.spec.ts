import { expect, test } from "@playwright/test";

for (const [name, width, height] of [
  ["figma-desktop", 1280, 900],
  ["wide-desktop", 1920, 1080],
  ["desktop-breakpoint", 1200, 900],
  ["small-desktop", 1024, 900],
  ["tablet", 768, 1024],
  ["small-tablet", 600, 900],
  ["mobile", 390, 844],
  ["small-mobile", 320, 740],
] as const) {
  test(`${name}: layout, local assets, and screenshot`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Find skilled professionals you can trust.",
    );
    for (const image of await page.locator(".shebacheck-home img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate((element: HTMLImageElement) => element.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(await page.locator(".home-technician").count()).toBe(4);
    const overflow = await page
      .locator(".shebacheck-home :is(h1,h2,h3,button,input,select)")
      .evaluateAll((elements) =>
        elements
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.left < -1 ||
                rect.right > window.innerWidth + 1 ||
                element.scrollWidth > element.clientWidth + 2)
            );
          })
          .map((element) => ({
            text: element.textContent,
            class: element.className,
          })),
      );
    expect(overflow).toEqual([]);
    await page.screenshot({
      path: `../.runtime/screenshots/${name}.png`,
      fullPage: true,
    });
    expect(errors).toEqual([]);
  });
}

test("category, zone, search, and empty state work together", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "AC Repair", exact: true }).click();
  await expect(page.locator(".home-technician")).toHaveCount(1);
  await expect(page.locator(".home-technician")).toContainText(
    "Tanvir Hossain",
  );
  await page.getByRole("button", { name: "Deep Clean", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No matching professionals" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show all professionals" }).click();
  await page
    .getByRole("button", { name: "Dhanmondi", exact: true })
    .first()
    .click();
  await expect(page.locator(".home-technician")).toHaveCount(2);
  await page.getByLabel("What service do you need?").fill("AC");
  await page
    .getByLabel("Service area", { exact: true })
    .selectOption("Gulshan 1 & 2");
  await page.getByRole("button", { name: "Find Pros" }).click();
  await expect(page.locator(".home-technician")).toHaveCount(1);
  await expect(page.locator(".home-search-feedback")).toContainText(
    "Gulshan & Banani",
  );
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".home-technician")).toHaveCount(4);
});

test("save persists and dialogs restore focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Save service for later" }).click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Remove saved service" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Verification Requirements", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "does not collect identity documents",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Verification Requirements",
      exact: true,
    }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Demo data", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "illustrative demo data",
  );
  await page.getByRole("button", { name: "Got it" }).click();
});

test("provider selection survives reload and booking validates before confirming", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "View Belal Ahmed's profile" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Belal Ahmed", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Belal Ahmed", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Book This Provider" }).click();
  await expect(page.getByLabel("Service type")).toHaveValue(
    "Leakage Diagnostic",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByLabel("Problem description")).toBeVisible();
  await page
    .getByLabel("Problem description")
    .fill("The kitchen sink pipe is leaking below the basin.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("House and road").fill("House 12, Road 4");
  await page.getByLabel("Area", { exact: true }).selectOption("Uttara Sectors");
  const date = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  await page.getByLabel("Appointment date").fill(date);
  await page.getByLabel("Phone number").fill("01712345678");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Review your request" }),
  ).toBeVisible();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Confirm demo booking" }).click();
  await expect(
    page.getByRole("heading", { name: "Demo booking confirmed" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Belal Ahmed");
  await expect(page.getByRole("status")).toContainText(
    "No actual appointment has been scheduled",
  );
});

test("mobile navigation and section links", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "How It Works" })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator("#how-it-works")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(130);
  await page
    .getByRole("navigation", { name: "Quick navigation" })
    .getByRole("button", { name: "Services" })
    .click();
  await expect
    .poll(() =>
      page
        .locator("#services")
        .evaluate((element) => element.getBoundingClientRect().top),
    )
    .toBeLessThan(130);
  await page
    .getByRole("navigation", { name: "Quick navigation" })
    .getByRole("button", { name: "Book Pro" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Request a service with clear terms" }),
  ).toBeVisible();
});
