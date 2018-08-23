const express = require('express');
const bodyParser = require('body-parser');
const leanEngine = require('./lc_instance');
const bearychat = require('./bearychat');
const zulip = require('./zulip');

function createRobot(opts, botOpts) {
  if (opts.type === 'bearychat') {
    return new bearychat.BearyChatRobot(botOpts);
  } else if (opt.type === 'zulip') {
    return zulip.ZulipRobot(botOpts);
  }
  return null;
}

/**
 * Required attrs of opts: chatService, chatServiceOptions, pathPrefix
 */
function createRobotApp(opts) {
  const expressApp = express();
  const lcRobot = createRobot(
    { type: opts.chatService },
    opts.chatServiceOptions
  );

  expressApp.use(leanEngine.express());
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));

  lcRobot.addKeywordHandler(['ping'], context =>
    context.respond({ text: 'pong' }));

  const pathPrefix = opts.pathPrefix || '/';
  let botPath = lcRobot.receivingPath();
  if (pathPrefix.endsWith('/') && botPath.startsWith('/')) {
    botPath = botPath.substr(1);
  }
  expressApp.post(pathPrefix + botPath, (req, res) => {
    //res.end();
    lcRobot.handleRequest(req.body, res);
  });

  return {
    expressApp,
    leanEngine,
    robot: lcRobot,
    run: () => {
      const PORT = parseInt(process.env.LC_APP_PORT || 3000, 10);
      expressApp.listen(PORT, () => {
        console.log('Node app is running, port:', PORT);
      });
    }
  };
}

module.exports = { createRobotApp };
