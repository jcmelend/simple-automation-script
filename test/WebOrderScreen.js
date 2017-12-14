/**
 * Main object to interact with order page.
 * @param hooks  The object that hold selenium objects to interact with browser.
 * @constructor
 */
function WebOrderScreen(hooks) {
    this.hooks = hooks;
    this.driver = hooks.getDriver();
    this.By = hooks.getWebDriver().By;
    this.until = hooks.getWebDriver().until;
    this.driver.findElement(this.By.xpath(".//*[text()='Payment Information']"));
}

/**
 * Adds random item to shopping card.
 * @param totalToAdd   The amount of items to add to shopping card.
 */
WebOrderScreen.prototype.addRandomItems = function(totalToAdd) {
    var driver = this.driver;
    var addToCart = '//*[@id="item-list"]//div[@class=\'sk-action-field\']//i';
    var elementsPromise = this.driver.findElements(this.By.xpath(addToCart));
    elementsPromise.then(function(elements) {
        for(var i = 0; i < elements.length; i++) {

            if(i < totalToAdd) {
                console.info("Adding random item");
                elements[i].click();
                driver.sleep(300); // TODO: fix this. Need to get rid of hard-coded waits.
            }else {
                return;
            }
        }
    });

    this.driver.wait(this.until.elementsLocated(this.By.xpath("//*[@id=\"shopping-cart\"]//input[@inputmode='numeric']")), 10000);
};

/**
 * To update quantity of items from shopping cart.
 * @param row      The table row starign from 1 to n.
 * @param quantity  The new quantity value to update with.
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.addQuantity = function(row, quantity) {

    var driver = this.hooks.getDriver();
    var By = this.hooks.getWebDriver().By;

    driver.findElement(By.xpath("//*[@id=\"shopping-cart\"]//input[@inputmode='numeric'][" + row +"]")).clear();
    return driver.findElement(By.xpath("//*[@id=\"shopping-cart\"]//input[@inputmode='numeric'][" + row +"]")).then(
        function (element) {
            return element.sendKeys(quantity).then(function() {
                console.info("Added quantity ");
                return true;
            });
        }
    );
};


/**
 * Get the total items added to shopping card.
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.getTotalShoppingItems = function() {


    var rowsExpath = '//*[@id="shopping-cart"]//tbody//tr';
    return this.driver.findElements(this.By.xpath(rowsExpath)).then(function(elements) {
         console.info("Returning total items added to shopping cart");
         return elements.length;
     });
};

/**
 * Starts a new order.
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.startNewOrder = function () {
    var driver = this.driver;
    var By = this.By;
    var until = this.until;

    return driver.findElement(By.xpath('//span[text()=\'New Order\']')).click().then(function (result) {
        console.info("Started new order.");
        return driver.findElement(By.xpath(".//*[text()='Payment Information']"));
    });
};

/**
 * Navigate to payment section.
 * @returns {*|void}
 */
WebOrderScreen.prototype.goToPayment = function() {
    return this.driver.findElement(this.By.xpath(".//*[text()='Payment Information']")).click();
};

/**
 * Navigates to payment summary section.
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.gotToProcessPayment = function() {
    var driver = this.driver;
    var By = this.By;
    var until = this.until;

    return driver.findElement(By.xpath(".//*[text()='Process Payment']")).click().then(function (value) {
        return driver.wait(until.elementLocated(By.xpath('//*[text()=\'New Order\']')), 10000).then(function (result) {
            driver.sleep(1000); // TODO: fix hard coded wait
            console.info("navigated to payment summary section.")
        });
    });
};

/**
 * Find the order total matching given value.
 * @param orderTotal   The order total value to find.
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.findOrderTotal = function(orderTotal) {
    var orderTotalXpath = this.By.xpath('//strong//*[text()=\'$' + orderTotal + '\']');
    return this.driver.findElement(orderTotalXpath).then(function (element) {
        console.info("Found order total of $" + orderTotal);
        return element.isDisplayed();
    });
};

/**
 * Find visible text that matches exactly the givne text.
 * @param text
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.findExactVisibleOrderTotal = function(text) {
    var exactText = this.By.xpath('//*[text()=\'$' + text + '\']');
    return this.driver.findElement(exactText).then(function(element) {
        console.info("Found visible text: $" + text);
        return element;
    });
};

/**
 * Find visible text matching given text
 * @param text
 * @returns {*}
 */
WebOrderScreen.prototype.findVisibleMatchingText = function(text) {
    var exactText = this.By.xpath('//*[contains(text(),\'' + text + '\']');
    return this.driver.findElement(exactText).isDisplayed();
};

/**
 * Gets all the total items displayed in the order summary table
 * @returns {PromiseLike<T> | Promise<T>}
 */
WebOrderScreen.prototype.getOrderTotalItems = function() {
    var orderTotalXpath = this.By.xpath('//div[@data-stepid=\'confirmation\']//table//tbody//tr');
    return this.driver.findElements(orderTotalXpath).then(function(elements){
        console.info('Returning total items ordered.');
        return elements.length;
    });
};

/**
 * Enter payment info
 * @param creditCardNumber   The credit card to use
 * @param experiationDate    the experiation date to use
 * @param securityCode       the security code to use
 */
WebOrderScreen.prototype.enterPayment = function(creditCardNumber, experiationDate, securityCode) {
    var driver = this.hooks.getDriver();
    var By = this.hooks.getWebDriver().By;
    var inputsXapth = '//div[@id=\'payment-information\']//input';

    var elementsPromise = driver.findElements(By.xpath(inputsXapth));

    elementsPromise.then(function (elements) {

        for(var i = 0; i < elements.length; i++) {
            if(i == 0) {
                elements[i].sendKeys(creditCardNumber);
            }else if(i == 1) {
                elements[i].sendKeys(experiationDate);

            }else if(i == 2) {
                elements[i].sendKeys(securityCode);
            }
        }
    });
};

module.exports = WebOrderScreen;