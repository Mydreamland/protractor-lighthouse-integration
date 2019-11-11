import { Config } from "protractor";

export let config: Config = {
  specs: ["./specs/test.js"],

  framework: "jasmine",
  capabilities: {
    browserName: "chrome",
    chromeOptions: {
      useAutomationExtension: false,
      args: [
        "--disable-gpu",
        "--disable-extensions",
        "--no-sandbox",
        "--disable-infobars",
        "--remote-debugging-port=4444"
      ]
    },
    loggingPrefs: {
      browser: "ALL"
    }
  }
};
