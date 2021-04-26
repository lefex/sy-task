/**
 * @file app.js
 * @author suyan
 * @description enable use import in browser
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const port = process.env.PORT || 8888;
const app = express();

const distDir = __dirname.replace('examples', 'dist');

// enable public html can access
app.use('/', express.static(path.join(__dirname, 'public')));
// enable dist file can access
app.use('/', express.static(distDir));

const logAccess = () => {
    fs.readdirSync(path.join(__dirname, 'public')).forEach(filename => {
        if (filename.endsWith('.html')) {
            // eslint-disable-next-line no-console
            console.log(`Open in browser http://localhost:${port}/${filename}`);
        }
    });
};

// start http server
app.listen(port, () => {
    logAccess();
});