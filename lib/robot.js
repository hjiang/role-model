class Robot {
  constructor() {
    this.predHandlerList = [];
  }

  receivingPath() {
    return '';
  }

  // subclass should implement this.
  stringToMatch(_) {
    throw Error('stringToMatch not implemented!');
  }

  createMessageContext(req, res) {
    // A subclass should attach a 'respond' method to send a reponse.
    return { request: req, response: res };
  }

  handleRequest(req, res) {
    let skip = false;
    this.predHandlerList.forEach((elem) => {
      const predFn = elem[0];
      const handlerFn = elem[1];
      const contextFn = elem[2];
      if (!skip && predFn(req)) {
        handlerFn(contextFn(this.createMessageContext(req, res)));
        skip = true;
      }
    });
    if (!skip) {
      res.end();
    }
  }

  addPredHandler(predFn, handlerFn, contextFn) {
    const ctxFn = contextFn || (ctx => ctx);
    this.predHandlerList.push([predFn, handlerFn, ctxFn]);
  }

  addKeywordHandler(words, handlerFn) {
    this.addPredHandler(
      req => words.every(val => this.stringToMatch(req).indexOf(val) >= 0),
      handlerFn
    );
  }

  addRegexHandler(re, handlerFn) {
    this.addPredHandler(
      req => re.test(this.stringToMatch(req)),
      handlerFn,
      (ctx) => {
        const newCtx = Object.assign({
          matches: re.exec(this.stringToMatch(ctx.request))
        }, ctx);
        return newCtx;
      }
    );
  }

  addHandler(pred, handlerFn) {
    if (pred instanceof Array) {
      this.addKeywordHandler(pred, handlerFn);
    } else if (pred instanceof RegExp) {
      this.addRegexHandler(pred, handlerFn);
    } else {
      this.addPredHandler(pred, handlerFn);
    }
  }
}


module.exports = { Robot };
