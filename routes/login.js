var express = require('express');
var router = express.Router();
// Controller.js 파일이 저장되어 있는 경로를 지정해서 조건이 맞다면 컨트롤러에 객체를 보내기 위한 설정
const controller = require('../controller/login');

/* GET home page. */


// controller 내부에서 작성한 index 함수로 이동하게 되면서 로직이 실행된다.
router.get('/', controller.index);
router.get('/login', controller.login);
// 이 라우터가 실행된다. controller 내부에서 작성된 write 함수를 찾아서 이동하고 로직이 실행된다.

module.exports = router;
