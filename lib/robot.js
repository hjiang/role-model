'use strict';
class Robot {
  constructor() {
    this.predHandlerList = [];
  }

  receivingPath() {
    return '';
  }

  createMessageContext(req) {
    // A subclass should attach a 'respond' method to send a reponse.
    return { request: req };
  }

  handleRequest(req) {
    let skip = false;
    this.predHandlerList.forEach(elem => {
      const predFn = elem[0];
      const handlerFn = elem[1];
      const contextFn = elem[2];
      if (!skip && predFn(req)) {
        handlerFn(contextFn(this.createMessageContext(req)));
        skip = true;
      }
    });
  }

  addPredHandler(predFn, handlerFn, contextFn) {
    const ctxFn = contextFn || ((ctx) => ctx);
    this.predHandlerList.push([predFn, handlerFn, ctxFn]);
  }

  addKeywordHandler(words, handlerFn) {
    this.addPredHandler((req) => words.every((val) => req.text.indexOf(val) >= 0),
                        handlerFn);
  }

  addRegexHandler(re, handlerFn) {
    this.addPredHandler((req) => re.test(req.text),
                        handlerFn,
                        (ctx) => {
                          const newCtx = Object.assign({
                            matches: re.exec(ctx.request.text),
                          }, ctx);
                          return newCtx;
                        });
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
