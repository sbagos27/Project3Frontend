
// https://group5project3-74e9cad2d6ba.herokuapp.com/
// pulling data from heroku works now
// v Run the code below in termincal in the project file
// node ApiScript.js
// might need to cd app 

import fetch from "node-fetch";

async function apiCall(url) {
  const res = await fetch(url);
  const contentType = res.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    return await res.text();
  }
}

async function apiCallAsString(url) {
  const res = await fetch(url);
  return await res.text();
}

export const pullTest = async () => {
  try {
    const data = await apiCall("https://group5project3-74e9cad2d6ba.herokuapp.com/api/posts/ping");
    console.log("Ping response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getData = async () => {
    try {
        const data = await apiCallAsString("https://group5project3-74e9cad2d6ba.herokuapp.com/api/posts/ping");
        return data;
    } catch (error) {
        console.log("Error:", error);
    }
};

// pullTest();

// this returns the data as a string, this is for my understanding - senen
// const hold = await getData();
// console.log(hold)
