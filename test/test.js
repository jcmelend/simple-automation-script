/**
 * Simple automation script to test an online order process.
 *
 */

var assert = require('assert');
var webdriver = require('selenium-webdriver');
var test = require('selenium-webdriver/testing');

/**Default suite timeout since mocha runner default is two seconds which is
 * not long enought for UI acceptance testing
 */
const sutieTimeOut = 90000;

/**
 * External libraries to interact with selenium driver and online order pages.
 *
 */
var Hooks = require('./Hooks.js');
var WebOrderScreen = require('./WebOrderScreen.js');

test.describe("Online Order suite", function() {

    /**
     * Set the default suite timeout. Mocha will stop
     * execution if all tests does not finish
     * with the specify timeout
     */
    this.timeout(sutieTimeOut);


    // create object that will hold objects to interact with selenium drivers and libraries
    var hooks = new Hooks(webdriver);

    /**
     * Launch browser and navigate to default location before launching tests
     */
    test.before(function(){
        hooks.launch();
    });

    /**
     * Quit driver after all test run
     */
    test.after(function(){
        hooks.quit();
    });

    /**
     * Tests start here
     */
    test.it("Purchase one item with quantity of 12", function() {

        /**
         * TODO: Test Data starts here (An option is to put test data
         * in CSV file and load data into dictionary))
         */
        // The total order amount expected for user to pay
        var expectedOrderTotal = "200.00";; //"101.00";

        // visibleOrderTotal from table to search in order summary page
        var visibleOrderTotal = "200.00"; //"1,200.00";

        // Total items to order
        var orderTotalItems = 1;

        // To indicate to update row 1 from shopping cart with quantity of 2
        var row = '1';
        var itemQuantity = 2;


        var webOrderScreen = new WebOrderScreen(hooks);

        // Add item to shopping cart
        webOrderScreen.addRandomItems(1);

        // Update quantity of added item in shopping cart
        webOrderScreen.addQuantity(row, itemQuantity);

        // Veriry that the expected total items were added successfully to shopping cart before
        // we navigate to payment section
        webOrderScreen.getTotalShoppingItems().then(function (val) {
            assert.equal(val, orderTotalItems, "Shopping cart items does not equal");
        });

        // Go to payment section
        webOrderScreen.goToPayment();

        // Enter payment
        webOrderScreen.enterPayment("2345898787899878", "1017", "678");

        // Purchase item
        webOrderScreen.gotToProcessPayment();

        // Verify all the total purchase items show up in the order summary table
        webOrderScreen.getOrderTotalItems().then(function (orderTotalItemsFound) {
            assert.equal(orderTotalItemsFound, orderTotalItems, "Found expected total items to order");
        });

        // Verify the expected total order total of the purchase charge to credit card is correct
        webOrderScreen.findOrderTotal(expectedOrderTotal).then(function(isDisplayed) {
            assert.equal(isDisplayed,  true, "Did not found expected order total of " + expectedOrderTotal);
        });

        // Verify items displayed in table have the correct order total amount
        webOrderScreen.findExactVisibleOrderTotal(visibleOrderTotal).then(function(element){
            assert.equal(element != null, true, "Found expected item total.");
        });

        // Lets start new order and verify we actually navigated to the start new order page.
        webOrderScreen.startNewOrder().then(function (paymentInformationElement) {
            assert.equal(paymentInformationElement != null, true, "Unable to navigate to new order start page.");
        });
    });
});

