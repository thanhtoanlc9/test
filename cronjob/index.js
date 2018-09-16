const CronJob = require('cron').CronJob;
const axios = require('axios');
const sampleSize = require('lodash/sampleSize');

const setting = require('../config/cronjob');

async function cronData() {
	const fetchData = await axios.get(setting.fetch_data);
	// const data = await fetchData.data;
}

function getBetNumbers() {
  let betNumber = [];
  for (let i = 0; i < 100; i++) {
    if (i < 10) {
      betNumber[i] = '0' + i;
    } else {
      betNumber[i] = i.toString();
    }

  }
  return betNumber;
}


// Crawl data from ketqua.net
const job = new CronJob(setting.cronTime, () => {
        cronData();
    }, () => {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    'Asia/Jakarta' /* Time zone of this job. */
);

// Check member prize
const cronCheckWin = new CronJob(setting.cronCheckWin, async () => {
        const checkData =  await axios.get(setting.check_data);
    }, () => {
        /* This function is executed when the job stops */
    },
    true, /* Start the job right now */
    'Asia/Jakarta' /* Time zone of this job. */
);

// var instance = axios.create({
//   timeout: 1000,
//   headers: {'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YTRiYjVmZGNjMGQ4MDQ2ZWRlNTBhMjYiLCJ1c2VybmFtZSI6ImJvb3QwMSIsImZ1bGxuYW1lIjoic2t5IHdhbGtlciIsImlhdCI6MTUxNDkxMTIzNX0.3M54R53FkjXuB8UaiHORF2c7unAi2S57pVoUN4BZ98c'}
// });
//
// const autoBet = new CronJob('00 * * * * *', () => {
//     const bet_numbers = getBetNumbers();
//     instance.post(setting.bet, {
//       amount: 10000,
//       bets: sampleSize(bet_numbers, 5)
//     })
//   }, () => {
//     /* This function is executed when the job stops */
//   },
//   true, /* Start the job right now */
//   'Asia/Jakarta' /* Time zone of this job. */
// );

// Send Mail member play
// const cronSendMail = new CronJob(setting.cronSendMail, () => {
//
// 		axios.get(setting.send_email);
//
//     }, () => {
//         /* This function is executed when the job stops */
//     },
//     true, /* Start the job right now */
//     'Asia/Jakarta' /* Time zone of this job. */
// );

console.log('job1 fetch result', job.running); // job1 status undefined
console.log('job2 check win', cronCheckWin.running); // job2 status undefined
// console.log('job3 auto bet', autoBet.running); // job2 status undefined
