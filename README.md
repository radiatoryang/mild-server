#mild-server

Mild is a very lightweight, very shitty multiplayer server framework via NodeJS and WebSockets. This is the Mild server (NodeJS, for deploment on Heroku, with possibilities for deploying on OpenShift too) ... Unity C# client is here: https://github.com/radiatoryang/mild-client

## Mild server setup (free, Heroku)
This is a very basic guide to getting your own multiplayer game server running -- it uses a cloud platform service called Heroku, which has a decent "free tier" of server features. With a bit of modification, you could also deploy this server on Redhat OpenShift as well, but this short guide will assume you're using Heroku.

1. Register a GitHub account, and fork this mild-server repository by clicking "Fork" in the upper-right of this page. You now have your own copy of the server code.
2. Register a Heroku account. http://heroku.com (recommended: Give them your credit card info to get "verified", they'll give you more monthly hours.)
3. In the Heroku deploy setup, connect it to your GitHub account, then tell it to deploy automatically from your "mild-server" fork on GitHub.
4. In the Heroku deploy setup, you might need to click the "manual deploy" button once, at the bottom of the page. Just to be safe. ("Deploy" means Heroku will grab the files off GitHub, and attempt to start the server process.)
5. Your server should now be operational! If you want to see server logs, install a free add-on plugin called "Papertrail", then click on the "Events" button in the Papertrail dashboard.
