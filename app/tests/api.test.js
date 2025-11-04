import { apiCall, apiCallAsString, getData } from "../ApiScript.js";

jest.setTimeout(10000); 

describe("API helper tests", () => {
  test("apiCall() returns JSON or text", async () => {
    const data = await apiCall("https://group5project3-74e9cad2d6ba.herokuapp.com/api/posts/ping");
    expect(data).toBeDefined();
  });

  test("apiCallAsString() returns a string", async () => {
    const data = await apiCallAsString("https://group5project3-74e9cad2d6ba.herokuapp.com/api/posts/ping");
    expect(typeof data).toBe("string");
  });

  test("getData() returns a string", async () => {
    const data = await getData();
    expect(typeof data).toBe("string");
  });
});