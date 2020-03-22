# htbr.me

A simple URL shortener designed to simplify your links.

See package.json for a list of dependencies. Bulma is used.

## Self-host

To self host, follow these steps:

### Cloning

Clone the repository - either use the command line or download it via the website.

### npm

Open the folder you put the cloned files into in a terminal application and run `npm i`.

### config.js

Create a new file in the root directory of your cloned files with the following contents (replace placeholders):

```js
module.exports = {
    port: 4000,
    db: 'NAME_OF_DB',
    discord: {
        id: 'DISCORD_CLIENT_ID',
        secret: 'DISCORD_CLIENT_SECRET',
        authedIDs: ["ALLOWED_DISCORD_IDS"]
    }
}
```

Replace ALLOWED_DISCORD_IDS with the IDs of the Discord users you want to be able to access the admin panel.
Replace NAME_OF_DB with the name of the database we will be creating in the next step.

### RethinkDB

This is the database we need to setup. Install RethinkDB by following the guides found on [their website](https://rethinkdb.com).

Open the web admin panel by going to hostname:8080. It will usually say this when you start Rethink.

Create a database with any name, and replace NAME_OF_DB in config.js with the chosen database name.

Create a table in that database and call it `urls`. It needs to be exact.

### Start the server

If you're happy with your settings, run `node .` in the terminal used before and it should boot up. Navigate to hostname:port to access the URL shortener.

Your port is found in your config.js file. You can change it if you wish.

## Modification

Logos etc. can be modified. Please see the `static/img` folder for images you can change.
If you would like to modify the CSS, please see the `static/css` folder. Bulma is used for the framework.

Please see the LICENSE file for more information on modification etc.
