#!/usr/bin/env node

const cheerio = require('cheerio')
const ReverseMd5 = require('reverse-md5')
const CFonts = require('cfonts');

process.stdout.write("\u001b[2J\u001b[0;0H");
process.stdout.write("\u001b[2J\u001b[0;0H");
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

var rev = ReverseMd5({
  lettersUpper: false,
	lettersLower: false,
	numbers: true,
	special: false,
	whitespace: false,
	maxLen: 7
})
const fs = require('fs');
let $;
const result = {};

function breakQuestion(filePath, i=0){
  const HTML = fs.readFileSync(filePath, 'utf-8');
  $ = cheerio.load(HTML);

  const questions = $('#quiz .quiz-list > li');
  const docTitle = $('title').html();
  const totleQ = $(questions).length;
  console.log('==========================================================')
  console.log(`                       ${docTitle}`)
  console.log(`              TOTAL QUESTIONS: ${totleQ} questions`);
  console.log(`               ESTIMATED TIME: ${Number($('input[type="radio"]').length)*7.6} seconds`);
  console.log('==========================================================')
  console.log('\n');

  if(i == totleQ) {
    return completeHacking(result);
  };
  const quizItem = $(questions[i]);
  const title = quizItem.find('.item-head h4').html().replace(/\n\t\t\t/g, ' ');
  console.log(title.trim());
  result[i] = {
    title: '',
    answer: '',
    label: ''
  };
  result[i].title = title;
  getAnswer(quizItem, i);
}

function getAnswer(quizItem, index) {
  let items = $(quizItem).find('input[type="radio"]');
  let isMulti = items.length>2;
  let labels = $(quizItem).find('label');
  let optionsLength = items.length;
  let answerList = (optionsLength==2)?['True', 'False']:['A', 'B', 'C', 'D', 'E', 'F'];
  let smallest;
  let answerIndex;
  let answerLabel;
  const symbol = '▋'
  process.stdout.write(`\x1b[90m  ${symbol}${' '.repeat(29)} 1% analyzing...\x1b[0m`);
  for(let i=0;i<optionsLength;i++) {
    const option = $(items[i]);
    const label = $(labels[i]).html();
    const hash = option.attr().value.replace('64-', '');
    const result = rev(hash);
    const decodedValue = Number(result.str);
    let loadingProcess = Math.floor(100/optionsLength)*Number(i+1);
    process.stdout.write("\r\x1b[K");
    process.stdout.write(`\x1b[90m  ${symbol.repeat(30*(loadingProcess/100))}${' '.repeat(30*(100-loadingProcess)/100)} ${loadingProcess}% analyzing...\x1b[0m`);
    // console.log(`${decodedValue} ${'.'.repeat(i+1)}`);
    if(!smallest || (decodedValue<smallest)) {
      smallest = decodedValue;
      answerIndex = i;
      answerLabel = label;
    }
  }
  result[index].answer = answerList[answerIndex];
  result[index].label = answerLabel;
  process.stdout.write("\r\x1b[K");
  if(isMulti){
    // console.log(`\x1b[32m  ☺ ${answerLabel.split(')')[1]}\x1b[0m`);
    console.log(`\x1b[32m  ☺ ${answerLabel.split(')')[1]}\x1b[0m`);
  }else{
    console.log(`\x1b[32m  ☺ ${answerList[answerIndex]}\x1b[0m`);
  }
  console.log('\n')
  breakQuestion(index+1);
}

function completeHacking(result){
  console.log('=======================  SUMMARY  =======================');
  for(let i=0;i<totleQ;i++) {
    console.log(`${i+1}) ${result[i].answer}`);
  }
  console.log('======================= COMPLETED =======================');
  process.exit(0)
}

module.exports = breakQuestion;