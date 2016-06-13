# RoLE model

## What's this?

RoLE stands for Robot on LeanEngine. It's a library for writing chat
robot hosted on
[LeanEngine](https://leancloud.cn/docs/leanengine_overview.html).
LeanEngine is a service provided by [LeanCloud](https://leancloud.cn).

## Instructions

RoLE is available on NPM. Add `"role-model": "^0.0.5"` to your `package.json`.

The package only exports one method `createRobotApp()`:
~~~javascript
const role = require('role-model');

const app = role.createRobotApp({
  chatService: 'bearychat',
  chatServiceOptions: { team: 'leancloud' },
})
~~~

As of this writing, BearyChat is the only supported service, but it is
very easy to add support to other services. Please contribute.

The returned object has three properties:
* `expressApp` - an Express app instance, which you can use to add
  additional routes and middleware.
* `leanEngine` - a LeanEngine SDK instance that you would otherwise
  get from `require('leanengine')`. This is provided just in case you
  need LeanCloud functionalities such as data storage.
* `robot` - this is the object you would use to define the behavior of
  your robot.

The robot is programmed by defining predicates to match incoming
messages and their handlers.

You can use a list of keywords:
~~~javascript
app.robot.addHandler(['ping'],
    context => context.respond({ text: 'pong' }));
~~~
If the incoming message has all the keywords, the handler will be executed.

Or you can use a regular expression:
~~~javascript
app.robot.addHandler(/ping/,
    context => context.respond({ text: 'pong' }));
~~~

Or to be most flexible, just a plain function:
~~~javascript
app.robot.addHandler((msg) => msg === "ping",
    context => context.respond({ text: 'pong' }));
~~~

At the end, call
~~~javascript
app.run()
~~~
This needs to be the last line in your main program, because it's
blocking (calls `expressApp.listen()`).

Now deploy your project to LeanCloud, configure your web hosting
domain name, and add a robot of type "Hubot" to your BearyChat team.
You should be able to receive responses from your new bot.

**Make sure you use Node 4+**, because RoLE uses some ES6 features. So add the following to your `package.json`:
~~~json
  "engines": {
    "node": "4.x"
  }
~~~

