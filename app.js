#!/usr/bin/env node

const https = require('https');
const chalk = require('chalk');
const inquirer = require('inquirer');
var privateKey = '';

const grab = (key) => {
  const postData = JSON.stringify({
    privateKey: key,
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = https.request(
    'https://OpCoin.aryaanish.repl.co/grab',
    options,
    (res) => {
      res.on('data', (data) => {
        const jsonData = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log(
            chalk.bold.green(`✔ ${jsonData.message}, trying again in 5 minutes`)
          );
        } else {
          console.log(
            chalk.bold.red(`❌ ${jsonData.message}, trying again in 5 minutes`)
          );
        }
      });
    }
  );

  req.write(postData);
  req.end();
};

inquirer
  .prompt([
    {
      type: 'input',
      name: 'privateKey',
      message: 'your private key: ',
    },
  ])
  .then((answers) => {
    if (!answers.privateKey) {
      console.error('No private key was provided');
    } else {
      privateKey = answers.privateKey;
      grab(privateKey);
    }
  })
  .catch((error) => {
    console.log(error);
  });

setInterval(() => {
  grab(privateKey);
}, 300000);
