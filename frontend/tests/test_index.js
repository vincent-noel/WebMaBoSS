/**
 * Dependency Modules
 */
var assert = require("assert").strict;
var webdriver = require("selenium-webdriver");
var chrome = require("selenium-webdriver/chrome");
require("geckodriver");

// Application Server
const serverUri = "http://localhost:8000/#";
const appTitle = "App Curie";

/**
 * Config for Chrome browser
 * @type {webdriver}
 */
var browser = new webdriver.Builder()
 .forBrowser('chrome')
 .setChromeOptions(new chrome.Options().)
 .build();
/**
 * Config for Firefox browser (Comment Chrome config when you intent to test in Firefox)
 * @type {webdriver}
 */
/*
var browser = new webdriver.Builder()
 .usingServer()
 .withCapabilities({ browserName: "firefox" })
 .build();
 */