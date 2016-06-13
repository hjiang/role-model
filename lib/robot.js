const needle = require('needle');

class Robot {
  constructor() {
    this.predHandlerList = [];
  }

  receivingPath() {
    return '';
  }

  createMessageContext(req) {
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
                          ctx.matches = re.exec(ctx.request.text);
                          return ctx;
                        });
  }
}

class BearyChatRobot extends Robot {
  constructor(opts) {
    super();
    this.team = opts.team;
    this.token = opts.token;
  }

  receivingPath() {
    return '/bearychat';
  }

  createMessageContext(req) {
    const context = super.createMessageContext(req);
    const url = `https://${this.team}.bearychat.com/api/hubot_hook/${req.token}`;
    context.bearychat = {
      team: this.team,
      token: this.token,
    };
    context.respond = (resp) => {
      needle.post(url,
                  { sender: req.sender, vchannel: req.vchannel,
                    text: resp.text },
                  { json: true },
                  (err) => {
                    if (err) {
                      console.error('ERROR: %s', err.message);
                    }
                  });
    };
    return context;
  }
}

function createRobot(opts, botOpts) {
  if (opts.type === 'bearychat') {
    return new BearyChatRobot(botOpts);
  }
  return null;
}

module.exports = { createRobot, Robot };
