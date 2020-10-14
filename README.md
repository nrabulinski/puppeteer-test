# puppeteer-test
This is the repository containing my soultion to the presented problem.

The bot works by, in order:
* creating a browser instance with randomly selected user-agent from the `UAs.json` file
* preparing a page with fake `navigator` object
* navigating to the specified website
* filling the form in with randomly generated gmail address and password
* submits the form and screenshots the resulting screen

Additionally it logs the current URL to the console to show that we're indeed not a student.

`UAs.json` contains data taken from [WhatIsMyBrowser.com](https://developers.whatismybrowser.com/useragents/explore/software_type_specific/web-browser/)