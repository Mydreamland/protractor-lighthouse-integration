import lighthouse = require("lighthouse");
import ReportGenerator = require("lighthouse/lighthouse-core/report/report-generator");
import * as lightExpect from "./lighthouse.expectation.json";
import * as fs from "fs";

export class LightHouseHelper {
  // method to run lighthouse audit
  lighthouseAudit = async url => {
    console.log("target url:", url);
    const opts = {
      logLevel: "info",
      output: "json",
      port: 4444
    };

    const lhr = await lighthouse(url, opts);
    return lhr;
  };

  // scrape data from a Lighthouse audit for asserting against
  getResult = async (_lhr, property) => {
    const propertyType = new Map()
      .set("contrast", await _lhr.lhr.audits["color-contrast"].score)
      .set(
        "vulnerabilities",
        await _lhr.lhr.audits["no-vulnerable-libraries"].score
      )
      .set("altText", await _lhr.lhr.audits["image-alt"].score)
      .set("pageSpeed", await _lhr.lhr.audits["speed-index"].score)
      .set(
        "ariaAttributeValuesCorrect",
        await _lhr.lhr.audits["aria-valid-attr-value"].score
      )
      .set(
        "ariaAttributesCorrect",
        await _lhr.lhr.audits["aria-valid-attr"].score
      )
      .set("duplicateId", await _lhr.lhr.audits["duplicate-id"].score)
      .set("tabIndex", await _lhr.lhr.audits.tabindex.score)
      .set("logicalTabOrder", await _lhr.lhr.audits["logical-tab-order"].score);
    const score = new Map()
      .set(0, "Fail")
      .set(1, "Pass")
      .set(null, "Pass");
    const result = await score.get(propertyType.get(property));
    return result;
  };

  //method to get lighthouse individual categories result after lighthouse audit
  getLighthouseResult = async (_lhr, property) => {
    const jsonProperty = new Map()
      .set(
        "accessibility",
        (await _lhr.lhr.categories.accessibility.score) * 100
      )
      .set("performance", (await _lhr.lhr.categories.performance.score) * 100)
      .set("progressiveWebApp", (await _lhr.lhr.categories.pwa.score) * 100)
      .set(
        "bestPractices",
        (await _lhr.lhr.categories["best-practices"].score) * 100
      )
      .set("seo", (await _lhr.lhr.categories.seo.score) * 100)
      .set("pageSpeed", (await _lhr.lhr.audits["speed-index"].score) * 100);
    const result = await jsonProperty.get(property);
    return result;
  };

  //method to generate lighthouse report
  getHtmlReport = lhr => {
    const html = ReportGenerator.generateReport(lhr, "html");
    fs.writeFile(
      `${process.cwd()}/reports/report-${new Date().getTime()}.html`,
      html,
      err => {
        if (err) {
          console.log(err);
        }
        console.log("Lighthouse report generated successfully");
      }
    );
  };

  // this method helps you to asset the lighthouse run programitacally
  checkLighthouseScanMeetsExpectation = async lhr => {
    const accessibilityScore = await this.getLighthouseResult(
      lhr,
      "accessibility"
    );
    const performanceScore = await this.getLighthouseResult(lhr, "performance");
    const bestPracticeScore = await this.getLighthouseResult(
      lhr,
      "bestPractices"
    );
    const progressiveWebAppScore = await this.getLighthouseResult(
      lhr,
      "progressiveWebApp"
    );

    // Assertions
    expect(accessibilityScore).toBeGreaterThan(lightExpect.accessibilityScore);
    expect(performanceScore).toBeGreaterThan(lightExpect.performanceScore);
    expect(bestPracticeScore).toBeGreaterThan(lightExpect.bestPracticeScore);
    expect(progressiveWebAppScore).toBeGreaterThan(
      lightExpect.progressiveWebAppScore
    );
  };
}

export const lrHelper = new LightHouseHelper();
