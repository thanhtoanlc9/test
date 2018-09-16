
const date = require('../helpers/time');

const path= require('path');

const MemberBet = require('mongoose').model('MemberBet');

const xl = require('excel4node');

exports.memberBetToday = async (req, res, next) => {

	const dateBet = date.getDateBet().format('DD-MM-YYYY').toString();

	const memberBetToday = await MemberBet.find({ date: dateBet }).exec();

	const filePath = path.join(__dirname, `../download/${dateBet}-Bet.xlsx`);

	// Create a new instance of a Workbook class 
	var wb = new xl.Workbook();

	// Add Worksheets to the workbook 
	var ws = wb.addWorksheet('Sheet 1');
	 
	// Create a reusable style 
	var styleHeading = wb.createStyle({
	    font: {
	        color: '#FF0800',
	        size: 12
	    }
	});

	var styleData = wb.createStyle({
	    font: {
	        color: '#000000',
	        size: 12
	    }
	});
	 
	// Set value of cell A1 to 100 as a number type styled with paramaters of style 
	ws.cell(1,1).string("STT").style(styleHeading);
	ws.cell(1,2).string("TÀI KHOẢN THÀNH VIÊN").style(styleHeading);
	ws.cell(1,3).string("CẶP SỐ").style(styleHeading);
	ws.cell(1,4).string("THỜI GIAN").style(styleHeading);
	ws.cell(1,5).string("SỐ TIỀN (VNĐ)").style(styleHeading);

	for (let i = 0; i < memberBetToday.length; i++) {
		ws.cell(i+2,1).number(i).style(styleData);
		ws.cell(i+2,2).string(memberBetToday[i].member_username).style(styleData);
		ws.cell(i+2,3).string(memberBetToday[i].bets.join(',')).style(styleData);
		ws.cell(i+2,4).string(memberBetToday[i].date).style(styleData);
		ws.cell(i+2,5).number(memberBetToday[i].amount).style(styleData);
	}
	 
	wb.write(filePath, (err, stats) => {

		if (err) throw new Error(err);

		return res.download(filePath);

	});
}