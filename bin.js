#!/usr/bin/env node

const breakQuestion = require('./index');
const CFonts = require('cfonts');
const filePath = process.argv[2] || './source.html';

process.stdout.write("\u001b[2J\u001b[0;0H");
CFonts.say('Hacking|Exam!', {
  // font: 'chrome',              // define the font face
  // align: 'left',              // define text alignment
  colors: ['yellow', 'green', 'cyan'],         // define all colors
  background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
  letterSpacing: 0,           // define letter spacing
  lineHeight: 1,              // define the line height
  space: true,                // define if the output text should have empty lines on top and on the bottom
  maxLength: '0',             // define how many character can be on one line
});

breakQuestion(filePath);