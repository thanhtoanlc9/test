var hostname = process.env.SITE_URL || "http://localhost:9999";

var setting = {
  cronTime: "00 35-60/3 18 * * *",
  cronSendMail: "00 00 18 * * *",
  cronCheckWin: "00 00 19 * * *",
  hostname: "localhost",
  post: 9999,
  fetch_data: `${hostname}/public-api/crawl`,
  check_data: `${hostname}/public-api/checkwin`,
  send_email: `${hostname}/public-api/send-email`,
  bet: `${hostname}/public-api-auth/bet`,
}

module.exports = setting;
