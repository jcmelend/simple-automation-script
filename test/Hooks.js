/**
 * Library that holds selenium objects to
 * interact with browsers.
 *
 * @param webDriver
 * @constructor
 */
function Hooks(webDriver) {
    this.webdriver = webDriver;
    this.assert = require('assert');
    this.driver = null;
    this.defaultImplicitWaitTimeout = 30000;
}

/**
 * Launch browser and navigate to default location.
 *
 */
Hooks.prototype.launch = function () {
    console.info("Launching web application....");
    if(this.driver == null) {
        this.driver = new this.webdriver.Builder().forBrowser('firefox').build()
        this.driver.manage().timeouts().implicitlyWait(this.defaultImplicitWaitTimeout);
        this.driver.get("http://skuid-qa-eval.force.com/WebOrderScreen");
    }
    console.info("Done launching web application.");
    return this.webdriver.promise.fulfilled(true);
};

/**
 * Quit drivers
 */
Hooks.prototype.quit = function() {
    console.info("Closing application");

    if(this.driver) {
        var promiseObject = this.driver.quit();
    }
    console.info("Successfully close application.");
    return promiseObject;

};

Hooks.prototype.setImplicitWaitTimeout = function(implicitWaitTimeout) {
    this.driver.manage().timeouts().implicitlyWait(implicitWaitTimeout);
};

Hooks.prototype.resetImplicitWaitTimeout = function() {
    this.driver.manage().timeouts().implicitlyWait(this.defaultImplicitWaitTimeout);
};

Hooks.prototype.getImplicitTimeout = function() {
    return this.defaultImplicitWaitTimeout;
};

Hooks.prototype.getDriver = function() {
    return this.driver;
};

Hooks.prototype.getWebDriver = function() {
    return this.webdriver;
};

module.exports = Hooks;
