const express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');

//ACCESS ROUTER TOPBANNER
router.get('/', function(req, res){
    console.log("[topBanner] topBanner를 요청하였습니다." + " [ " + dateFormat(Date(), "yyyy-mm-dd, h:MM:ss TT") + " ] " )
    var responseData = {
        "check": true,
        "code": 200,
        "topBannerList": [
            "욕설 및 비방은 금지해주세요",
            "5번 이상 신고된 게시글은 자동 삭제됩니다",
            "기숙사 앱 많은 관심 부탁드립니다",
            "불편한 사항이 있으시면 피드백을 남겨주세요",
            "피드백은 저희에게 큰 힘이 됩니다"
        ]
    };
    res.json(responseData);
});


module.exports = router;









