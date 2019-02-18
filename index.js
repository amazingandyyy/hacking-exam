#!/usr/bin/env node

const cheerio = require('cheerio')
const ReverseMd5 = require('reverse-md5')

var rev = ReverseMd5({
  lettersUpper: false,
	lettersLower: false,
	numbers: true,
	special: false,
	whitespace: false,
	maxLen: 7
})

const fs = require('fs');
const filePath = process.argv[2] || './source.html';
const HTML = fs.readFileSync(filePath, 'utf-8');

const $ = cheerio.load(HTML)

const questions = $('#quiz .quiz-list > li');
const docTitle = $('title').html();
const totleQ = $(questions).length;
console.log('\n');
console.log('=====================================')
console.log(`BREAKING EXAM ${docTitle}`)
console.log(`TOTAL QUESTIONS: ${totleQ} questions`);
console.log(`ESTIMATED TIME: ${Number(totleQ)*7.6*3.5} seconds`);
console.log('=====================================')
console.log('\n');

const result = {};

function breakQuestion(i){
  if(i == totleQ) {
    return printResult(result);
  };
  const quizItem = $(questions[i]);
  const title = quizItem.find('.item-head h4').html().replace(/\n\t\t\t/g, ' ');
  console.log(title);
  result[i] = {
    title: title,
  }
  getAnswer($(quizItem).find('input[type="radio"]'), i)
}

const tf = ['True', 'False'];
const mt = ['A', 'B', 'C', 'D', 'E', 'F']

function getAnswer(item, index) {
  let smallest = 10000000;
  let answer;
  for(let i=0;i<item.length;i++) {
    const option = $(item[i]);
    const hash = option.attr().value.replace('64-', '');
    const result = rev(hash);
    const resultNum = Number(result.str);
    // console.log(`option ${i+1}: ${resultNum}`);
    console.log('.'.repeat(i+1));
    if(resultNum){
      if(resultNum<smallest){
        smallest = resultNum;
        answer = i;
      }
    }
  }
  if(item.length==2){
    result[index] = {
      answer: tf[answer]
    }
    console.log('Answer:', tf[answer]);
  }else{
    result[index] = {
      answer: mt[answer]
    }
    console.log('Answer:', mt[answer]);
  }
  console.log('\n')
  breakQuestion(index+1);
}

function printResult(result){
  console.log('===============  SUMMARY  ===============');
  for(let i=0;i<totleQ;i++) {
    console.log(i+1, result[i].answer);
  }
  console.log('=============== COMPLETED ===============');
}

breakQuestion(0)