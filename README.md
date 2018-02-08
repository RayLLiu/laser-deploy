# GithubWebhookAutoDeployment

A web service that handles github push events to automatically deploy to the server.

## Quick Start
Pre-request:
1. Linux based OS
2. Node installed

Steps:
1. Download the repo to your server.
2. Go to the project folder and run `$ yarn install`
3. Go to config.template.js, to change the configuration.
For example:
in my server the repo is located at `/root/repo`
And my repo url is `https://github.com/RayLLiu/githubWebhookAutoDeployment`,
 copy `RayLLiu/githubWebhookAutoDeployment` .
 After that, create a secret string (keep it private)
 If your service is running on pm2, you will also need to add pm2 process id.



 4. After that, change the `config.template.json` to `config.json`
 Your `config.js` should be simillar to this:
 `{
  "PORT": 8888,
  "adminPassword": "",
  "adminEnabled": true,
  "repos": [{
    "full_name": "",
    "secret": "",
    "fullPath": "",
    "restartService": false,
    "pm2ProcessID": ""
  }],
  "deployAPIendpoint": "deploy"
}`
5. If you just want to update the repo on the server, leave the restartService to `false` and no need to add a `pm2ProcessID`.

After configuration, run `node index.js` to fire-up the web service.

Now, remember your secret and port, deployAPIendpoint.



6. Go to your github repo, in the `settings`, go to `webhooks`
Create a new webhook.

7. In the webHooks, in the Payload URL, put the url of the server for example: `http://blah.com:{yourport}/{deployAPIendpoint}`

8. Set the content type to `application/json`

9. put the same secret to the secret.

10. Set the event to `Just push event`

11. Set `Active`


Now you can push something to master and the server should be updated immediately.

If you run more services on the same service, just add more config objects to `config.js` and repeat the steps above.

## Tests

Install mocha

`yarn add mocha global`

Run the unit tests

`mocha`

## Contributors

Originally authored by  [@RayLLiu](https://github.com/RayLLiu)
 and maintained by [@RayLLiu](https://github.com/RayLLiu)

Currently maintained by [@RayLLiu](https://github.com/RayLLiu)
