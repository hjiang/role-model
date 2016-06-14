const needle = require('needle');
const robot = require('./robot.js');

class BearyChatRobot extends robot.Robot {
  constructor(opts) {
    super();
    this.team = opts.team;
    this.token = opts.token;
  }

  receivingPath() {
    return '/bearychat';
  }

  // TODO: check the request token if this.token is set.
  createMessageContext(req) {
    const context = super.createMessageContext(req);
    const url = `https://${req.subdomain}.bearychat.com/api/hubot_hook/${req.token}`;
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

module.exports = { BearyChatRobot };
