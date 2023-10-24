"use strict";

const getQuoteBtn = document.querySelector("#new-quote-btn");
const quoteEl = document.querySelector(".quote");
const authorEl = document.querySelector(".author");

let getNewQuote = function () {
  fetch("https://dummy-apis.netlify.app/api/quote")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      quoteEl.innerText = `"${data.quote}"`;
      authorEl.innerText = `-${data.author}`;
    });
};

getQuoteBtn.addEventListener("click", getNewQuote);
