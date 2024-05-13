import supertest from "supertest";
import { fail, strictEqual } from "assert";
import { Player } from "../model/player.mjs";

import {
  validate_fields,
  validate_alphanumeric,
  validate_email,
  validate_phone,
} from "../utils/validate-fields.mjs";

var super_request = supertest("http://localhost:3000");

describe("Stock app test cases", function () {
  describe("Tests Model", function () {
    describe("Player", function () {
      let firstName = "kunal";
      let lastName = "sikka";
      let email = "kunal@mun.ca";
      let contact = "7096431624";
      let username = "kunal123";
      let password = "kunali1234";
      let isAdmin = true;

      it("Test if the player is invalid (Invalid first Name)", async function () {
        let player = new Player(
          "@#$&^%54vsgtga",
          lastName,
          email,
          contact,
          username,
          password,
          isAdmin
        );
        strictEqual(
          await validate_fields(
            player.firstName,
            player.lastName,
            player.email,
            player.contact
          ),
          false
        );
        strictEqual(await validate_alphanumeric(player.firstName), false);
      });

      it("Test if the player is invalid (Invalid last Name)", async function () {
        let player = new Player(
          firstName,
          "@#$&^%54vsgtga",
          email,
          contact,
          username,
          password,
          isAdmin
        );
        strictEqual(
          await validate_fields(
            player.firstName,
            player.lastName,
            player.email,
            player.contact
          ),
          false
        );
        strictEqual(await validate_alphanumeric(player.lastName), false);
      });

      it("Test if the player is invalid (Invalid email)", async function () {
        let player = new Player(
          firstName,
          lastName,
          "charvi@123.12",
          contact,
          username,
          password,
          isAdmin
        );
        strictEqual(
          await validate_fields(
            player.firstName,
            player.lastName,
            player.email,
            player.contact
          ),
          false
        );
        strictEqual(await validate_email(player.email), false);
      });

      it("Test if the player is invalid (Invalid contact)", async function () {
        let player = new Player(
          firstName,
          lastName,
          email,
          "709876werc",
          username,
          password,
          isAdmin
        );
        strictEqual(
          await validate_fields(
            player.firstName,
            player.lastName,
            player.email,
            player.contact
          ),
          false
        );
        strictEqual(await validate_phone(player.contact), false);
      });
    });
  });

  describe("Test API calls", function () {
    describe("Players", async function () {
      it("1. fails to register user- Test invalid first Name in the object", async function () {
        this.timeout(10000);
        let data = {
          firstName: "#$#@##!$#@4",
          lastName: "sikka",
          email: "kunal@mun.ca",
          contact: "7093452575",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(
          respo.text,
          "Error. The Player was not inserted in the database since it is not valid."
        );
      });

      it("2. fails to register user- Test invalid last Name in the object", async function () {
        this.timeout(10000);
        let data = {
          firstName: "kunal",
          lastName: "(*&^%^!#dse32)",
          email: "kunal@mun.ca",
          contact: "7093452575",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(
          respo.text,
          "Error. The Player was not inserted in the database since it is not valid."
        );
      });

      it("3. fails to register user- Test invalid email in the object", async function () {
        this.timeout(10000);
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "kunal@123.123",
          contact: "7093452575",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(
          respo.text,
          "Error. The Player was not inserted in the database since it is not valid."
        );
      });

      it("4. fails to register user- Test invalid contact in the object", async function () {
        this.timeout(10000);
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "kunal@mun.ca",
          contact: "#@!#$@#!#$@Ddsr12",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(
          respo.text,
          "Error. The Player was not inserted in the database since it is not valid."
        );
      });

      it("5. Success User is registered- Test user created", async function () {
        this.timeout(10000);
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "kunal@mun.ca",
          contact: "7098761234",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };
        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Contact correctly inserted in the Database.");

        let dltData = {
          username: "kunalsikka123",
          gameName: "sample",
          email: "kunal@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("6. Fails- GET /getStockPrice/?symbol= (Not valid alphanumeric provided)", async function () {
        this.timeout(10000);
        let symbol = "@#@!@";
        let res = await super_request.get("/getStockPrice?symbol=" + symbol);
        strictEqual(res.text, "Invalid symbol");
      });

      it("7. Fails- GET /getStockPrice/?symbol= (Stock not found)", async function () {
        this.timeout(10000);
        let symbol = "APL";
        let res = await super_request.get("/getStockPrice?symbol=" + symbol);
        strictEqual(res.text, "Stock not found");
      });

      it("8. Success- GET /getStockPrice/?symbol= (Stock found)", async function () {
        this.timeout(10000);
        let symbol = "AAPL";
        let res = await super_request.get("/getStockPrice?symbol=" + symbol);

        strictEqual(res.statusCode, 200);
      });

      it("9. fails to buy stock - Test invalid quantity in the object", async function () {
        this.timeout(10000);
        let qnt = "@&@";
        let symbol = "AAPL";
        let username = "kunalsikka124";
        let gameName = "sample";
        let respo = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Invalid credentials");
      });

      it("10. fails to buy stock - Test invalid symbol in the object", async function () {
        this.timeout(10000);

        let qnt = 20;
        let symbol = "@@@";
        let username = "kunalsikka124";
        let gameName = "sample";

        let respo = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Invalid credentials");
      });

      it("11. fails to buy stock - Test user doesn't exist", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "AAPL";
        let username = "kunalsikka124";
        let gameName = "sample";
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal1234",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);

        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }

        let respo = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Username not found");
        let dltData = {
          username: "kunal1234",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("12. fails to buy stock user- Test game doesn't exist", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "AAPL";
        let username = "kunalsikka124";
        let gameName = "mygame";
        let respo = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Game not found");
      });

      it("13. fails to buy stock user- Test Not enough cash", async function () {
        this.timeout(10000);
        let qnt = 1000000;
        let symbol = "AAPL";
        let username = "kunal123";
        let gameName = "sample";
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);

        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }
        let respo = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Not sufficient money");

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("14. Success to buy stock user- Test Stock bought successfully", async function () {
        this.timeout(10000);
        let qnt = 100;
        let symbol = "AAPL";
        let username = "kunal123";
        let gameName = "sample";
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);

        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }
        let respo = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("15. fails to sell stock user- Test invalid quantity", async function () {
        this.timeout(10000);
        let qnt = "@@@";
        let symbol = "AAPL";
        let username = "kunal123";
        let gameName = "sample";

        let respo = await super_request
          .post(
            `/sell?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Invalid credentials");
      });

      it("16. fails to sell stock user- Test invalid symbol", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "@@@";
        let username = "kunal123";
        let gameName = "sample";

        let respo = await super_request
          .post(
            `/sell?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Invalid credentials");
      });

      it("17. fails to sell stock user- Test stock not found", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "APL";
        let username = "kunal123";
        let gameName = "sample";

        let respo = await super_request
          .post(
            `/sell?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Stock not found");
      });

      it("18. fails to sell stock user- Test game not found", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "AAPL";
        let username = "kunal123";
        let gameName = "mygame";

        let respo = await super_request
          .post(
            `/sell?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.text, "Game not found");
      });

      it("19. fails to sell stock user- Test don't have enough shares", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "IBM";
        let username = "kunal123";
        let gameName = "sample";
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);

        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }
        let respo = await super_request
          .post(
            `/sell?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();
        strictEqual(respo.text, "Zero shares of " + symbol + "available");

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("20. Success to sell stock user- Test Stock is sold successfully", async function () {
        this.timeout(10000);
        let qnt = 20;
        let symbol = "IBM";
        let username = "kunal123";
        let gameName = "sample";
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);

        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }

        let respon = await super_request
          .post(
            `/buy?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
          )
          .set("Content-Type", "application/json")
          .send();

        if (respon.text === "Market is closed") {
          strictEqual(respon.statusCode, 200);
        } else {
          let respo = await super_request
            .post(
              `/sell?quantity=${qnt}&symbol=${symbol}&username=${username}&gameName=${gameName}`
            )
            .set("Content-Type", "application/json")
            .send();
          strictEqual(respo.statusCode, 200);
        }

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("21. fails to login- Test username not found", async function () {
        this.timeout(10000);
        let data = {
          username: "kunal12345",
          password: "kunal1234",
        };

        let respo = await super_request
          .post(`/login`)
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Incorrect Username");
      });

      it("22. fails to login- Test Incorrect password", async function () {
        this.timeout(10000);
        let data = {
          username: "kunal123",
          password: "kunal123",
        };
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .post(`/login`)
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Incorrect password");

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("23. Success login- Test Successful login", async function () {
        this.timeout(10000);
        let data = {
          username: "kunal123",
          password: "kunal1234",
        };
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .post(`/login`)
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("24. fails to createGame- Test user doesn't exist", async function () {
        this.timeout(10000);
        let Name = "newGame";
        let creatorusername = "kunal12345";
        let description = "a sample game";

        let respo = await super_request
          .post(
            `/createGame?Name=${Name}&creatorusername=${creatorusername}&description=${description}`
          )
          .set("Content-Type", "application/json")
          .send();

        strictEqual(
          respo.text,
          "Player with username " + creatorusername + " not found"
        );
      });

      it("25. fails to createGame- Test user doesn't have admin access", async function () {
        this.timeout(10000);
        let Name = "newGame";
        let creatorusername = "kunal1234";
        let description = "a sample game";
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal1234",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }

        let respo = await super_request
          .post(
            `/createGame?Name=${Name}&creatorusername=${creatorusername}&description=${description}`
          )
          .set("Content-Type", "application/json")
          .send();

        strictEqual(
          respo.text,
          "Forbidden! Don't have admin access to create a new game"
        );

        let dltData = {
          username: "kunal1234",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("26. fails to createGame- Test same name game already exists", async function () {
        this.timeout(10000);
        let Name = "sample";
        let creatorusername = "kunal123";
        let description = "a sample game";
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: true,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .post(
            `/createGame?Name=${Name}&creatorusername=${creatorusername}&description=${description}`
          )
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.text, "A game with same name already exists");

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("27. Successfully created a game- Test game created succesfully", async function () {
        this.timeout(10000);
        let Name = "newGame";
        let creatorusername = "kunal123";
        let description = "a sample game";
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: true,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .post(
            `/createGame?Name=${Name}&creatorusername=${creatorusername}&description=${description}`
          )
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };

        let newgme = "newGame";
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
        await super_request
          .post(`/deleteGame?name=${newgme}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("28. fails to get all games- Test no games available in the db", async function () {
        this.timeout(10000);

        let respo = await super_request
          .get(`/getAllGames`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.text, "No games found");
      });

      it("29. Sucess to get all games- Test Sucess", async function () {
        this.timeout(10000);
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .get(`/getAllGames`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("30. fails to find the game- Test no game available by this name", async function () {
        this.timeout(10000);

        let name = "sample";
        let respo = await super_request
          .get(`/getGame?Name=${name}`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.text, "Game not found");
      });

      it("31. Sucess, was able to find the game- Test Game found", async function () {
        this.timeout(10000);
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let gme = "sample";
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .get(`/getGame?Name=${gme}`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("32. fails to update password- Test invalid email in the object", async function () {
        this.timeout(10000);
        let data = {
          username: "kunalsikka123",
          email: "kunal@mun.123",
          newPassword: "kunal1234",
        };
        let respo = await super_request
          .post("/resetPassword")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Invalid credentials");
      });

      it("33. fails to update password- Test user not found", async function () {
        this.timeout(10000);
        let data = {
          username: "kunalsikka123",
          email: "kunal@mun.ca",
          newPassword: "kunal1234",
        };
        let respo = await super_request
          .post("/resetPassword")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "No player found with matching credentials");
      });

      it("34. Success password updated- Test password updated", async function () {
        this.timeout(10000);
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "kunal@mun.ca",
          contact: "7098761234",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };
        let data1 = {
          username: "kunalsikka123",
          email: "kunal@mun.ca",
          newPassword: "kunal12345",
        };
        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Contact correctly inserted in the Database.");
        let respon = await super_request
          .post("/resetPassword")
          .set("Content-Type", "application/json")
          .send(data1);
        strictEqual(respon.statusCode, 200);
        let dltData = {
          username: "kunalsikka123",
          gameName: "sample",
          email: "kunal@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("35. fails to find the games- Test invalid username", async function () {
        this.timeout(10000);

        let name = "@@@@@@@@@@@@@";
        let respo = await super_request
          .get(`/getUserRegisteredGames?username=${name}`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.text, "No player found with matching credentials");
      });

      it("36. Success, games found- Test found games", async function () {
        this.timeout(10000);
        let Name = "newGame";
        let creatorusername = "kunal123";
        let description = "a sample game";
        let name = "kunalsikka123";

        this.timeout(10000);
        let data = {
          firstName: "kunal",
          lastName: "sikka",
          email: "kunal@mun.ca",
          contact: "7098761234",
          username: "kunalsikka123",
          password: "kunal1234",
          isAdmin: true,
        };

        let gamedata;
        if (data.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data.game;
        }
        let respo = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data);

        let response = await super_request
          .post(
            `/createGame?Name=${Name}&creatorusername=${creatorusername}&description=${description}`
          )
          .set("Content-Type", "application/json")
          .send();
        let respon = await super_request
          .get(`/getUserRegisteredGames?username=${name}`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunalsikka123",
          gameName: "sample",
          email: "kunal@mun.ca",
        };

        let newgme = "newGame";
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
        await super_request
          .post(`/deleteGame?name=${newgme}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("37. fails to login in a game- Test username not found", async function () {
        this.timeout(10000);
        let data = {
          username: "kunal12345",
          password: "kunal1234",
          gameName: "sample",
        };

        let respo = await super_request
          .post(`/loginGame`)
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Incorrect Username or game name");
      });

      it("38. fails to login- Test Incorrect password", async function () {
        this.timeout(10000);
        let data = {
          username: "kunal123",
          password: "kunal123",
          gameName: "sample",
        };
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .post(`/loginGame`)
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.text, "Incorrect password");

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("39. Success login- Test Successful login", async function () {
        this.timeout(10000);
        let data = {
          username: "kunal123",
          password: "kunal1234",
          gameName: "sample",
        };
        let data1 = {
          firstName: "kunal",
          lastName: "sikka",
          email: "ckuni@mun.ca",
          contact: "7096311623",
          username: "kunal123",
          password: "kunal1234",
          isAdmin: false,
        };
        let resp = await super_request
          .post("/register")
          .set("Content-Type", "application/json")
          .send(data1);

        let gamedata;
        if (data1.game === undefined) {
          gamedata = "sample";
        } else {
          gamedata = data1.game;
        }
        let respo = await super_request
          .post(`/loginGame`)
          .set("Content-Type", "application/json")
          .send(data);
        strictEqual(respo.statusCode, 200);

        let dltData = {
          username: "kunal123",
          gameName: "sample",
          email: "ckuni@mun.ca",
        };
        await super_request
          .post("/deleteContact")
          .set("Content-Type", "application/json")
          .send(dltData);
        await super_request
          .post(`/deleteGame?name=${gamedata}`)
          .set("Content-Type", "application/json")
          .send();
      });

      it("40. Sucess to find the market status- Test market status found", async function () {
        this.timeout(10000);

        let respo = await super_request
          .get(`/marketStatus`)
          .set("Content-Type", "application/json")
          .send();

        strictEqual(respo.statusCode, 200);
      });
    });
  });
});
