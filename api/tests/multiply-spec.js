/**
 * Created by jonathan on 23/02/16.
 */
var helloWorld = require("./utils");

describe("Calculations", function() {
    it("returns 6", function() {
        expect(helloWorld.multiply(2, 3)).toBe(6);
    });
    it("returns 8", function() {
        expect(helloWorld.multiply(2, 4)).toBe(8);
    });
});