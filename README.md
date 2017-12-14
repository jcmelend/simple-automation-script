# simple-automation-script

The purpose of this project is to show an example of using mochajs
for browser acceptance automation.

The following dependencies are needed to be install before running
the simple automation acceptance script from this project:

npm install -g mocha
npm install selenium-webdriver
npm install geckodriver
npm install chromedriver

Note: This is a simple script. Many this are missing from script which will be improved
in future:

1) Abstraction for each automation acceptance script test data
2) Come up with better automation design patterns such as page object patter, journey pattern, etc.
and many more..


Running Test Case:

npm test

Note: there is a bug in website that I am using where order total is not correct.