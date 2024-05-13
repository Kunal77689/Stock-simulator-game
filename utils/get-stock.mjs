import axios from "axios";
const get = axios.get;

export async function getStockValues(symb) {
  let uri = "https://finnhub.io/api/v1/quote?symbol=";
  let symbol = symb;
  let key = "cnppf7pr01qgjjvqtkggcnppf7pr01qgjjvqtkh0";

  let response = await get(uri + symbol + "&token=" + key);

  return response.data;
}

export async function getMarketStatus() {
  let uri =
    "https://finnhub.io/api/v1/stock/market-status?exchange=US&token=cnppf7pr01qgjjvqtkggcnppf7pr01qgjjvqtkh0";

  let response = await get(uri);

  return response.data.isOpen;
}

export default { getStockValues, getMarketStatus };
