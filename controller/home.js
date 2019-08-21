const db = require('../config/database');
const mysql = require('mysql2/promise');

// 메인
const index = async function index(req, res) {

    var pageNum = 5;    // 페이지 개수
    var listNum = 20;   // 페이지당 출력할 개수

    console.log("ggg")
    const connection = await mysql.createConnection(db);

    try {
        var pageNo = (typeof req.body.pageNo == 'undefined') ? 1 : req.body.pageNo;


        var idSearch = (typeof req.body.idSearch == 'undefined') ? '' : req.body.idSearch;
        var nameSearch = (typeof req.body.nameSearch == 'undefined') ? '' : req.body.nameSearch;
        var nickSearch = (typeof req.body.nickSearch == 'undefined') ? '' : req.body.nickSearch;

        let reqData = {};
        reqData.pageNo = pageNo;
        reqData.idSearch = idSearch;
        reqData.nameSearch = nameSearch;
        reqData.nickSearch = nickSearch;

        console.log("reqData : " + reqData);


        // count는 행의 수를 세는 역할을 하기 때문에 hello 테이블에 저장되어 있는 행의 총 개수를 구하는 쿼리문
        // WHERE 1=1의 의미는 항상 참이라는 것을 말한다. 동적으로 조건적을 붙이고 싶을 때 아주 유용하다.
        let sqlTotalCount = "SELECT count(*) cnt FROM clover WHERE 1=1 ";

        //검색 옵션
        var srcCondition = ' ';
        if(idSearch != '') {
            srcCondition = srcCondition + ' AND id in (' + idSearch + ') ';
        }
        if(nameSearch != '') {
            srcCondition = srcCondition + ' AND name in (' + nameSearch + ') ';
        }
        if(nickSearch != '') {
            srcCondition = srcCondition + ' AND nick in (' + nickSearch + ') ';
        }

        sqlTotalCount = sqlTotalCount + srcCondition;

        console.log("ddddddddd : " + sqlTotalCount);

        const [totalCountRows] = await connection.query(sqlTotalCount);


        // cnt에 담긴 db값 중에 배열이 0번 째인 값을 가져오는 소스코드
        var totalCount = totalCountRows[0].cnt;

        // 페이징 처리
        // 총 리스트에서 페이지당 출력할 개수를 나누어서 나타날 페이지 개수
        // 출력될 페이지 = 총 리스트 / 페이지당 출력할 개수
        var numOfPages = Math.ceil(totalCount/listNum);
        // 시작 페이지 = ((pageNo-1) / 페이지 개수) * 페이지 개수 + 1)
        var startPageNum = Math.ceil(((pageNo-1) / pageNum) * pageNum + 1);
        // 마지막 페이지 = ((시작 페이지 + 페이지 개수 > 출력될 페이지) 조건이
        // 참이면 출력 될 페이지 ... 거짓이면 시작 페이지 + 페이지 개수 - 1
        var endPageNum = Math.ceil((startPageNum +pageNum > numOfPages) ?  numOfPages : startPageNum +pageNum -1);
        // 출력될 페이지 < 페이지 개수
        if(numOfPages < pageNum){
            // 시작 페이지 = 1
            startPageNum = 1;
            // 마지막 페이지 - 시작 페이지 > 페이재 개수
        }else if( (endPageNum - startPageNum) < pageNum){
            // 시작 페이지 = (마지막 페이지 - 페이지 개수 + 1)
            startPageNum = (endPageNum - pageNum+1)
        }

        // numfrom = pageNo가 1이면 1 - 1 * 20 = 0 이니까 0 ... 2라면 2 - 1 * 20 = 20 이니까
        // pageNo값에따라 numfrom 변수에 0, 20, 40, 60가 대입된다.

        var numfrom =((pageNo) -1)*(listNum);
        console.log("numfrom : " + numfrom)
        // db에 저장되어 있는 no, id, name, nick 값을 불러오기 위한 쿼리문
        let sqlList = "SELECT no, id, name, nick FROM clover WHERE 1=1 ";
        // 불러온 쿼리문 중에 no(숫자)를 기준으로 oder by desc 오름차순 정렬
        // LIMIT는 값에 따라(numfrom)부터 (listNum)까지로 제한하는 쿼리
        sqlList = sqlList + 'order by no desc ' +
            'LIMIT '+numfrom+','+listNum+'; ';
        console.log("sqlList : " + sqlList)

        const [listRows] = await connection.query(sqlList);
        // index라는 이름의 view 페이지로 pageNo, startPageNum, endPageNum, numOfPages, listRows, totalCount전달
        res.render('home', {
            pageNo: pageNo,
            startPageNum: startPageNum,
            endPageNum: endPageNum,
            numOfPages: numOfPages,
            data: listRows,
            totalCount : totalCount
        });

    } catch (err) {
        console.log(err);
        connection.rollback();
    } finally {
        connection.end();

    }
};

// 등록
const write = async function write(req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let nick = req.body.nick;

    let reqData = {};
    reqData.id = id;
    reqData.name = name;
    reqData.nick = nick;
    console.log("reqData :", reqData);

    const connection = await mysql.createConnection(db);

    try {

        let insert = "INSERT INTO clover (id, name, nick) VALUES (?, ?, ?)";
        console.log("aaaaaaaaaa");
        const [insertWrite] = await connection.query(insert, [id, name, nick]);
        console.log("result : " + JSON.stringify(insertWrite));

        res.end();

    } catch (err) {
        console.log(err);
        connection.rollback();
    } finally {
        connection.end();
    }
};

// 수정할 정보 가져오기
const updateView = async function updateView(req, res) {

    console.log("ggggg")
    let id = req.query.id;

    console.log(id);
    const connection = await mysql.createConnection(db);

    try {

        let updateView = "SELECT id, name, nick FROM clover WHERE id=?";
        const [updateViewer] = await connection.query(updateView, [id]);
        console.log("result : " + JSON.stringify(updateViewer));

        res.send({updateViewer : updateViewer});

    } catch (err) {
        console.log(err);
        connection.rollback();
    } finally {
        connection.end();
    }
};

//  정보 수정
const update = async function update(req, res) {

    let id = req.body.id_update;
    let name = req.body.name_update;
    let nick = req.body.nick_update;

    let reqData = {};
    reqData.id_update = id;
    reqData.name_update = name;
    reqData.nick_update = nick;

    console.log("updateInfo reqData :", reqData);

    const connection = await mysql.createConnection(db);

    try {

        let updateInfo = "UPDATE clover SET name = ?, nick = ? WHERE id = ? ";
        const [updateInfoRows] = await connection.query(updateInfo, [name, nick, id]);

        res.end();

    } catch (err) {
        console.log(err);
        connection.rollback();
    } finally {
        connection.end();
    }
};

// 삭제
const deleteInfo = async function deleteInfo(req, res) {

    let id = req.body.id;
    let name = req.body.name;
    let nick = req.body.nick;

    let reqData = {};
    reqData.id = id;
    reqData.name = name;
    reqData.nick = nick;
    console.log("ddddddddd reqData :", reqData);

    const connection = await mysql.createConnection(db);

    try {
        let idDelete = "DELETE FROM clover WHERE id = ? ";
        const [idDeleteResult, deleteFields] = await connection.query(idDelete, [id]);


        res.end();
    } catch (err) {
        console.log(err);
        connection.rollback();
    } finally {
        connection.end();
    }
};


module.exports = { index, write, updateView, update, deleteInfo };