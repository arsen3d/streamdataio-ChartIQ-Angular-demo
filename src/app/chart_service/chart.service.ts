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

function generateUUID(){
	var d = new Date().getTime();
	if(window.performance && typeof window.performance.now === "function"){
		d += window.performance.now(); //use high-precision timer if available
	}
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
  return uuid;
}

export class StockMarketFeed extends StreamDataIoFeed {

  constructor(chart) {
    super(chart, "http://35.195.161.13:8080/app/statuscode/simulate/chartiq", "<YOUR STREAMDATA TOKEN>");
  }


  public fetchInitialData(symbol, startDate, endDate, params, cb) {
    var guid = generateUUID();
    var queryUrl = "https://simulator.chartiq.com/datafeed?session=" + guid +
		"&identifier=" + symbol +
		"&startdate=" + startDate.toISOString()  +
		"&enddate=" + endDate.toISOString()  +
		"&interval=" + params.interval +
		"&period=" + params.period +
     "&extended=" + (params.stx.extendedHours?1:0);   // using filter:true for after hours
  let that = this;
	CIQ.postAjax(queryUrl, null, function(status, response){
		// process the HTTP response from the datafeed
		if(status==200){ // if successful response from datafeed
      var feeddata=JSON.parse(response);
      var newQuotes=[];
      for(var i=0;i<feeddata.length;i++){
        newQuotes[i]={};
        newQuotes[i].DT=new Date(feeddata[i].DT); // DT is a string in ISO format, make it a Date instance
        newQuotes[i].Open=feeddata[i].Open;
        newQuotes[i].High=feeddata[i].High;
        newQuotes[i].Low=feeddata[i].Low;
        newQuotes[i].Close=feeddata[i].Close;
        newQuotes[i].Volume=feeddata[i].Volume;
      }
			cb({quotes:newQuotes, attribution:{source:"simulator", exchange:"RANDOM"}}); // return the fetched data; init moreAvailable to enable pagination
		} else { // else error response from datafeed
			cb({error:(response?response:status)});	// specify error in callback
		}
	});
  }

  private _extractQuotes(response) {
    try {
      return JSON.parse(response);
    } catch (e) {
      return [];
    }
  }

  protected buildSymbolUrl(serviceUrl: string, symbol: string) {
    return `${serviceUrl}`;
  }

  protected  formatLastQuote(symbol, quote): any {
    var i = 0;
    while(quote[i].ticker != symbol) {
      i++;
    }
    return {
      Last: quote[i].last,
      Volume: quote[i].volume,
      DT: new Date().getTime()
    };
  }

}
