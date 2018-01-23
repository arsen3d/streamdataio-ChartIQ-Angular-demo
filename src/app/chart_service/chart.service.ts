import * as _exports from '../../chartiq_library/js/chartiq';
import '../../chartiq_library/js/quoteFeedSamples';
import {StreamDataIoFeed} from './streamdataio.feed';

var CIQ = _exports.CIQ;

export class ChartService {

  constructor() {
  }

  attachQuoteFeed(chart): void {
    chart.attachQuoteFeed(new StockMarketFeed(chart));
  }
}

export class StockMarketFeed extends StreamDataIoFeed {

  constructor(chart) {
    super(chart, "http://stockmarket.streamdata.io/v2/prices", "<YOUR STREAMDATA TOKEN>");
  }

  public fetchInitialData(symbol, startDate, endDate, params, cb) {

    if (symbol || symbol === "") {
      symbol = symbol.toUpperCase();
    } else {
      cb({quotes: [], moreAvailable: false});  //short circuit ajax request
      return;
    }
    if (symbol.charAt(0) != "^" && CIQ.Market.Symbology.isForexSymbol(symbol)) symbol = "^" + symbol;
    let url = "https://demoquotes.chartiq.com/" + symbol.replace(/\//g, "-");
    let that = this;
    CIQ.postAjax(url, null, function (status, response) {
      if (status != 200) {
        cb({error: status});
        return;
      }
      let quotes = that._extractQuotes(response);
      let newQuotes = [];
      for (let i = 0; i < quotes.length; i++) {
        newQuotes[i] = {};
        newQuotes[i].Date = quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
        newQuotes[i].Open = quotes[i][1];
        newQuotes[i].High = quotes[i][2];
        newQuotes[i].Low = quotes[i][3];
        newQuotes[i].Close = quotes[i][4];
        newQuotes[i].Volume = quotes[i][5];
        newQuotes[i].Adj_Close = quotes[i][6];
      }
      params.noUpdate = true;   //Daily demo quotes do not support updates
      cb({quotes: newQuotes, moreAvailable: false, attribution: {source: "demoquotes", exchange: "RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
    });
  }

  private _extractQuotes(response) {
    let varName = response.substr(0, response.indexOf("="));
    let valueToParse = response.substring(response.indexOf(varName + "=") + (varName + "=").length, response.length - 1);
    try {
      return JSON.parse(valueToParse.replace(/,0+/g, ",0").replace(/,[.]/g, ",0.").replace(/;/g, ""));
    } catch (e) {
      return [];
    }
  }

  protected buildSymbolUrl(serviceUrl: string, symbol: string) {
    return `${serviceUrl}/${symbol}`;
  }

  protected  formatLastQuote(symbol, quote): any {
    return {
      Last: quote.last,
      Volume: quote.volume,
      DT: new Date(quote.dt)
    };
  }

}
