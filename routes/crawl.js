var express = require('express');
var router = express.Router();

var request = require('request');
var cheerio = require('cheerio');

var split = require('lodash/split');

const Result = require('mongoose').model('Result');

router.get('/', function(req, res, next) {

    const day = req.query.day;
    let URL_KETQUA = 'http://ketqua.net/';

    if (day){
        URL_KETQUA = 'http://ketqua.net/xo-so-truyen-thong.php?ngay=' + day;
    }

    request(URL_KETQUA, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            const $ = cheerio.load(body);

            // Ket qua
            var resultDom = $('#result_tab_mb');

            var dateRegex = resultDom.find('#result_date').text().match(/(\d{2})-(\d{2})-(\d{4})/g);

            var date = dateRegex[0];

            // Result Html
            var result = resultDom.parent().html();

            // Result
            let index = 1;

            let ketqua = [];
            let giai = {
                giai: '',
                xs: []
            };

            $('#result_tab_mb tbody tr').each((i, tr) => {

                if (i == 3 || i == 6) {
                    index = 0;
                } else {
                    index = 1;
                }

                $(tr).find('td').each((_i, td) => {
                    if (_i == 0) {
                        giai.giai = $(td).text() !== "" ? $(td).text() : giai.giai;
                    } else {
                        giai.xs.push($(td).text());
                    }
                });

                if (index) {
                    ketqua.push(giai);
                    giai = {
                        giai: '',
                        xs: []
                    };
                }

            });


            // Get loto
            const loto = [];
            $('#loto_mb tbody td').each((i, el) => {
                loto[i] = ($(el).text());
            });

            var dateArray = split(date, '-');

            var results = {
                date: date,
                day: dateArray[0],
                month: dateArray[1],
                year: dateArray[2],
                result: result,
                ketqua: ketqua,
                lottery_loto: loto,
                updated: new Date(),
            };

            Result.find({ date: date }).then(function(doc){
              if (doc.length) {
                Result.update({ date: date }, results).exec();
              } else {
                results.created = new Date();
                new Result(results).save();
              }
            });

            res.json(loto);

        } else {
            res.sent(err);
        }
    });
});

router.get('/second', function(req, res, next) {

  const day = req.query.day;
  let URL_KETQUA = 'http://www.ketqua888.com/';

  if (day){
    URL_KETQUA = 'http://ketqua.net/xo-so-truyen-thong.php?ngay=' + day;
  }

  request(URL_KETQUA, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(body);

      // Ket qua
      var resultDom = $('#kq');

      var dateRegex = resultDom.find('.date').text().match(/(\d{2})-(\d{2})-(\d{4})/g);

      var date = dateRegex[0];

      // Result Html
      var result = resultDom.parent().html();
      // Result
      let index = 1;

      let ketqua = [];
      let giai = {
        giai: '',
        xs: []
      };
      const text = $('#tructiep_table').text();
      // $('#tructiep_table tbody tr').each((i, tr) => {
      //
      //   if (i%2===1) {
      //     index = 0;
      //   } else {
      //     index = 1;
      //   }
      //   // console.log('test index', index, $(tr).text())
      //   // $(tr).find('td').each((_i, td) => {
      //   //   if (_i == 0) {
      //   //     giai.giai = $(td).html();
      //   //   }
      //   // });
      //   giai.giai = $(tr).html();
      //   if (index) {
      //     ketqua.push(giai);
      //     giai = {
      //       giai: '',
      //       xs: []
      //     };
      //     console.log('index 1', i)
      //   } else {
      //     console.log('index 0', i)
      //   }
      //
      // });
      res.json({
        date: date,
        ketqua: ketqua,
        text: text,
        result: resultDom.text()
      });

    } else {
      res.sent(err);
    }
  });
});

module.exports = router;
