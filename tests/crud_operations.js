const Wishlist = require("../models/wishlist");
const faker = require("@faker-js/faker").fakerEN_US;
const { factory, seed_db, testUserPassword } = require("../utils/seed_db");

describe("tests for crud operations", function () {
  before(async () => {
    const { expect, request } = await get_chai();
    this.test_user = await seed_db();
    let req = request.execute(app).get("/session/logon").send();
    let res = await req;
    const textNoLineEnd = res.text.replaceAll("\n", "");
    this.csrfToken = /_csrf\" value=\"(.*?)\"/.exec(textNoLineEnd)[1];
    let cookies = res.headers["set-cookie"];
    this.csrfCookie = cookies.find((element) =>
      element.startsWith("csrfToken"),
    );
    const dataToPost = {
      email: this.test_user.email,
      password: testUserPassword,
      _csrf: this.csrfToken,
    };
    req = request
      .execute(app)
      .post("/session/logon")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .redirects(0)
      .send(dataToPost);
    res = await req;
    cookies = res.headers["set-cookie"];
    this.sessionCookie = cookies.find((element) =>
      element.startsWith("connect.sid"),
    );
    expect(this.csrfToken).to.not.be.undefined;
    expect(this.sessionCookie).to.not.be.undefined;
    expect(this.csrfCookie).to.not.be.undefined;
  });

  it("get wishlist", async () => {
    const req = request
      .execute(app)
      .get("/wishlist")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded");
    const pageParts = res.text.split("<tr>");
    expect(pageParts).to.equal(20);
  });

  it("Add a wishlist entry", async () => {
    const dataToPost = {
      name: () => faker.commerce.productName(),
      description: () => faker.commerce.productDescription(),
      priority: () => [Math.floor(5 * Math.random())],
      _csrf: this.csrfToken,
    };
    const req = request
      .execute(app)
      .post("/wishlist")
      .set("Cookie", this.csrfCookie)
      .set("content-type", "application/x-www-form-urlencoded")
      .send(dataToPost);
    const list = await Wishlist.find({ createdBy: this.test_user._id });
    expect(list.length).to.equal(21);
  });
});
