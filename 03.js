const fs = require('fs');
const path = require('path');
const superagent = require('request');
const cheerio = require('cheerio');
const async = require('async');

let imagesUrl = [];
let index = 0;

for (let i = 1; i <= 5; i++) {
  let url = 'http://www.27270.com/tag/625';
  let u = i === 1 ? url + '.html' : url + '_' + i + '.html';
  let obj = {
    url: u,
    headers:{
      'User-Agent': 'request'
    }
  }
  imagesUrl.push(obj);
}

function all(err, res, body) {
  let $ = cheerio.load(body);
  index = index + $('.Tag_list li a img').length;
  $('.Tag_list li a img').each((index, el) => {
    let _this = $(el);
    let src = _this.attr('src');
    let imgName = parseInt(Math.random() * 1000) + path.basename(src.toString());
    downloadImg(src, imgName, () => {
      console.log(imgName + '下载完成')
    })
  })
}

function downloadImg (url, name, callback) {
  let stream = fs.createWriteStream('./images/' + name);
  superagent(url).on('error', () => {
    console.log('done no')
  }).pipe(stream).on('close', callback);
}

async.mapLimit(imagesUrl, 3, (url, callback) => {
  superagent(url, all),
  callback(null)
}, (err, result) => {
  if (err) {
    console.log(err)
  } else {
    console.log('开始下载')
  }
})
