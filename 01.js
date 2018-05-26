const cheerio = require('cheerio');
const superagent = require('superagent');
const fs = require('fs');

const url = 'http://duanziwang.com/category/%E7%BB%8F%E5%85%B8%E6%AE%B5%E5%AD%90/';
let data = [];
function getData (index) {
  for (let i = 1; i < index; i++) {
    let u = i === 0 ? url : url+ i + '/'
    superagent.get(u).end((err, res) => {
      if (err) {
        return console.error(err)
      }
      let $ = cheerio.load(res.text);
      $('body').find('main.main-content').find('article.post').each((index, el) => {
        let _this = $(el);
        data.push({
          title: _this.find('h1.post-title').children('a').text(),
          time: _this.find('div.post-meta').children('time:nth-child(1)').text(),
          like: _this.find('div.post-meta').children('time:nth-child(3)').find('a.post-like').children('span').text(),
          content: _this.find('div.post-content').children('p').text()
        })
        console.log(data)
        fs.writeFile('./data/data.json', JSON.stringify({
          status: 0,
          data: data
        }), (err) => {
          if (err) throw err
          console.log('写入完成')
        })
      })
    })
  }
}
getData(5);
