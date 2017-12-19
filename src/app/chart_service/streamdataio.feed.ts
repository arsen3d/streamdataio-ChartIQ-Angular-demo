      import {StreamData, StreamDataIo, StreamDataServer} from 'streamdataio-js-sdk';
import {applyPatch} from 'fast-json-patch';

export abstract class StreamDataIoFeed {

  private _streams: Map<string, StreamData>;

  // This is setd by ChartIq
  public subscriptions: any[];

  constructor(private _chartEngine,
              private _serviceUrl,
              private _token) {
    this._streams = new Map<string, StreamData>();
  }

  public abstract fetchInitialData(symbol, startDate, endDate, params, cb);

  public subscribe(params) {
    if (params.symbol || params.symbol === "") {
      // Retrieve symbol and comparaison information
      let symbol = params.symbol.toUpperCase();
      let secondary = this.subscriptions && this.subscriptions.length > 0;

      // Build the specific url to call from service url and symbol
      let symbolUrl = this.buildSymbolUrl(this._serviceUrl, symbol);

      // Create event source
      let myEventSource = StreamDataIo.createEventSource(symbolUrl, this._token);
      let lastQuote = null;
      myEventSource.onData((data) => {
          lastQuote = data;
          this._appendLast(lastQuote, symbol, secondary);
        }, this)
        .onPatch((patch) => {
          applyPatch(lastQuote, patch);
          this._appendLast(lastQuote, symbol, secondary);
        }, this)
        .onError((error) => {
          console.error('%o', error);
        });
      this._streams.set(symbol, myEventSource);
      myEventSource.open();
    }

  }

  /**
   * Return the url to call in order to retrieve symbol information
   *
   * @param serviceUrl
   * @param symbol
   */
  protected abstract buildSymbolUrl(serviceUrl: string, symbol: string);

  private _appendLast(lastQuote, symbol, secondary) {
    let formatedQuote = this.formatLastQuote(symbol, lastQuote);
    if (secondary) {
      this._chartEngine.appendMasterData(formatedQuote, null, {fillGaps: true, secondarySeries: symbol});
    } else {
      this._chartEngine.appendMasterData(formatedQuote, null, {fillGaps: true});
    }

  }

  /**
   * Return a object representing the last value for the given symbol
   * {
   *   Last: <last>,
   *   Volume: <volume>,
   *   DT: <datetime>
   * }
   * @param symbol
   * @param quote
   * @private
   */
  protected abstract formatLastQuote(symbol, quote): any;

  public unsubscribe(params) {
    if (params.symbol || params.symbol === "") {
      let symbol = params.symbol;
      if (this._streams.has(symbol)) {
        this._streams.get(symbol).close();
        this._streams.delete(symbol);
      }
    }

  }


}
