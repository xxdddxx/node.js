const db = require('../config/database');
const mysql = require('mysql2/promise');


const index = async function index(req, res) {

    res.render('login', {
    });
};

// 로그인
const login = async function login(req, res) {
    var id = (typeof req.query.id == 'undefined') ? "" : req.query.id;

    let reqData = {};
    reqData.id = id;
    console.log(reqData);
    const connection = await mysql.createConnection(db);
    try {
        const sql = 'SELECT id FROM clover WHERE Id = ?';
        const [login] = await connection.query(sql, [id]);

        if(login == "") {
            res.render('/')
        } else {
            res.end()
        }

    } catch (err) {
        console.log(err);
        connection.rollback();
    } finally {
    }
};

module.exports = {index, login };