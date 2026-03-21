const puppeteer = require("puppeteer");
require("../app");
const { seed_db, testUserPassword } = require("../utils/seed_db");
const Wishlist = require("../models/wishlist");

let testUser = null;

let page = null;
let browser = null;
// Launch the browser and open a new blank page
describe("wishlist-ejs puppeteer test", function () {
  before(async function () {
    this.timeout(10000);
    //await sleeper(5000)
    browser = await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    await page.goto("http://localhost:3000");
  });
  after(async function () {
    this.timeout(5000);
    await browser.close();
  });
  describe("got to site", function () {
    it("should have completed a connection", async function () {});
  });
  describe("index page test", function () {
    this.timeout(10000);
    it("finds the index page logon link", async () => {
      this.logonLink = await page.waitForSelector("a ::-p-text(Logon)");
    });
    it("gets to the logon page", async () => {
      await this.logonLink.click();
      await page.waitForNavigation();
      const email = await page.waitForSelector('input[name="email"]');
    });
  });
  describe("logon page test", function () {
    this.timeout(20000);
    it("resolves all the fields", async () => {
      this.email = await page.waitForSelector('input[name="email"]');
      this.password = await page.waitForSelector('input[name="password"]');
      this.submit = await page.waitForSelector("button ::-p-text(Logon)");
    });
    it("sends the logon", async () => {
      testUser = await seed_db();
      await this.email.type(testUser.email);
      await this.password.type(testUserPassword);
      await this.submit.click();
      await page.waitForNavigation();
      await page.waitForSelector(`p ::-p-text(Hello ${testUser.name}!)`);
      await page.waitForSelector('a[href="/wishlist"]');
    });
  });

  describe("puppeteer job operations", function () {
    this.timeout(20000);
    it("tests getting list", async () => {
      const { expect } = await import("chai");
      const wishlistLink = await page.waitForSelector(
        "a ::-p-text(My Wishlist)",
      );
      await wishlistLink.click();
      await page.waitForNavigation();
      const content = await page.content();
      const list = content.split("<tr>");
      expect(list.length).to.equal(22);
    });

    it("brings up add item form", async () => {
      const { expect } = await import("chai");
      const addLink = await page.waitForSelector("a ::-p-text(Add Item)");
      await addLink.click();
      await page.waitForNavigation();
      await page.waitForSelector('input[name="name"]');
    });

    it("resolves all the fields", async () => {
      this.name = await page.waitForSelector('input[name="name"]');
      this.description = await page.waitForSelector(
        'input[name="description"]',
      );
      this.priority = await page.waitForSelector('select[name="priority"]');
      this.submit = await page.waitForSelector("button ::-p-text(Create)");
    });

    it("sends the Item", async () => {
      const { expect } = await import("chai");
      await this.name.type("testItem");
      await this.description.type("testDescription");
      await this.priority.type("5");
      await this.submit.click();
      await page.waitForNavigation();
      await page.waitForSelector(`p ::-p-text(item created.)`);
      const items = await Wishlist.find({ createdBy: testUser._id });
      expect(items.length).to.equal(22);
      const copyr = await page.waitForSelector("p ::-p-text(copyright)");
      const copyrText = await copyr.evaluate((el) => el.textContent);
      console.log("copyright text: ", copyrText);
    });
  });
});
