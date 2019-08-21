var express = require('express');
var router = express.Router();
// Controller.js 파일이 저장되어 있는 경로를 지정해서 조건이 맞다면 컨트롤러에 객체를 보내기 위한 설정
const controller = require('../controller/home');

/* GET home page. */


// app.js 에서 경로가 '/' 일때는 index.js 의 router 설정을
// 경로가 '/users' 일때는 users.js 의 router 설정을 타도록 해주었다.

// 그렇기 때문에 이 라우터가 실행이 되고 '/' 경로를 타고 왔다면
// controller 내부에서 작성한 index 함수로 이동하게 되면서 로직이 실행된다.
router.get('/', controller.index);
// View 페이지에서 ajax를 이용해 작성한 url로 서버를 요청하면 중간에서 받은 후에
// 컨트롤러에 객체를 내보내는 역할을 하는 라우터 설정이다.
// View 페이지에서 data 를 담아서 보낼 때 경로를 /write 로 그리고 post 방식으로 보냈다면
// 이 라우터가 실행된다. controller 내부에서 작성된 write 함수를 찾아서 이동하고 로직이 실행된다.
router.post("/write", controller.write);
router.get("/updateView", controller.updateView);
router.put("/update", controller.update);
router.put('/delete', controller.deleteInfo);


module.exports = router;
