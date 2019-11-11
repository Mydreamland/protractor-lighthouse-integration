import "jasmine";
import { browser } from "protractor";
import { lrHelper } from "./lighthouse/lighthouse.helper";

describe("Open Angular Docs and run a lighthouse scan", () => {
  beforeEach(async () => {
    await browser.waitForAngularEnabled(false);
    await browser.get("https://angular.io/");
  });

  it("scan webpage and generate lighthouse report", async () => {
    const pageCurrentURL = await browser.getCurrentUrl();

    const lhr = await lrHelper.lighthouseAudit(pageCurrentURL);
    lrHelper.getHtmlReport(lhr.lhr);
    lrHelper.checkLighthouseScanMeetsExpectation(lhr);
  });
});
