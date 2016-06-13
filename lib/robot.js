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
      if (!skip && elem[0](req)) {
        elem[1](this.createMessageContext(req));
        skip = true;
      }
    });
  }

  addPredHandler(predFn, handlerFn) {
    this.predHandlerList.push([predFn, handlerFn]);
  }

  addKeywordHandler(words, handlerFn) {
    this.addPredHandler((req) => words.every((val) => req.text.indexOf(val) >= 0),
                        handlerFn);
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
