//1. Import coingecko-api
import CoinGecko from 'coingecko-api';
//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

import fetch from 'node-fetch';



async function main() {
    getBNBPrice();
    console.log(await AskData());

}

main();




let priceBNB = getBNBPrice();
let priceTHC = getTHCPrice();
let priceTHG = getTHGPrice();
let priceWBNB = getWBNBPrice();

function refreshPrices() {
    priceBNB = getBNBPrice();
    priceTHC = getTHCPrice();
    priceTHG = getTHGPrice();
    priceWBNB = getWBNBPrice();
}

//get THG "thetan-arena" price
async function getTHGPrice() {
    let respuestaCoinGecko = await CoinGeckoClient.coins.fetch('thetan-arena')
    return respuestaCoinGecko.data.market_data.current_price.usd;
}

//get BNB "binancecoin" price
async function getBNBPrice() {
    let respuestaCoinGecko = await CoinGeckoClient.coins.fetch('binancecoin')
    return respuestaCoinGecko.data.market_data.current_price.usd;
}

//get THC "thetan-coin" price
async function getTHCPrice() {
    let respuestaCoinGecko = await CoinGeckoClient.coins.fetch('thetan-coin')
    return respuestaCoinGecko.data.market_data.current_price.usd;
}

//get wbnb "wbnb" price
async function getWBNBPrice() {
    let respuestaCoinGecko = await CoinGeckoClient.coins.fetch('wbnb')
    return respuestaCoinGecko.data.market_data.current_price.usd;
}




/* 
fetch("https://data.thetanarena.com/thetan/v1/nif/search?sort=Latest&heroRarity=0&skinRarity=0&priceMin=0&priceMax=300000000&from=0&size=16", {
  "headers": {
    "accept": "application/json",
    "accept-language": "es-419,es;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "max-age=0",
    "content-type": "application/json",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://marketplace.thetanarena.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

*/

async function AskData(){

let sort = 'Latest';
let battleMin = 400;
let battleMax = 1000;
let batPercentMin = 40;
let batPercentMax = 100;
let priceMin = 0;
let decimals = 100000000;
let priceMax = 1 * decimals;
let page = 1;

    let respuestaCoinGecko = await fetch(`https://data.thetanarena.com/thetan/v1/nif/search?from=0&size=16`,{
        "headers": {
          "authority": "data.thetanarena.com",
          "accept": "application/json",
          "accept-language": "es-419,es;q=0.9,en-US;q=0.8,en;q=0.7",
          "cache-control": "max-age=0",
          "content-type": "application/json",
          "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"96\", \"Google Chrome\";v=\"96\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Linux\"",
          "sec-fetch-dest": "empty","express-session": "^1.17.1",
          "connect-mongo": "^4.4.1",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site"
        },
        "referrer": "https://marketplace.thetanarena.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
      });

    return respuestaCoinGecko;
}



// https://data.thetanarena.com/thetan/v1/nif/search?sort=${sort}&priceMin=${priceMin}&priceMax=${priceMax}&battleMin=${battleMin}&battleMax=${battleMax}

