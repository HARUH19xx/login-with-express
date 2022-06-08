const express = require('express');
const app = express();
const mysql = require('mysql2')
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);

//DBとsession
//DBの設定
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'do',
    password: 'adeerafemaledeer',
    database: 'cdur'
  });

//storeを設定し、DBと結びつける
const sessionStore = new MySQLStore(connection);

//セッションの設定
const session_opt = {
    secret: 'adropofgoldensun',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    cookie: {
      maxAge: 60*60*1000
    }
};

//DBに接続
connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return
  };
  console.log('connection success!');
});


//ミドルウェアを起動
//リクエストのbodyをパースする
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//publicディレクトリを静的ファイル(HTML等)のルートディレクトリとする
app.use(express.static(path.join(__dirname, 'public')));

//セッション開始
app.use(session(session_opt))

//ログイン処理
app.get('/api/v1/login/:name', (req, res) => {
  //connect database
  const name = req.params.name;
  connection.query(`SELECT * FROM voter WHERE id = ${name}`, (error, results) => {
      res.json(results)
  });
});

//get all voters
app.get('/api/v1/voters', (req, res) => {
    //connect database
    connection.query(`SELECT * FROM voter`, (error, results) => {
        res.json(results)
    });
});

//get a voter
app.get('/api/v1/voters/:id', (req, res) => {
    //connect database
    const id = req.params.id;
    connection.query(`SELECT * FROM voter WHERE id = ${id}`, (error, results) => {
        if (!results) {
            res.send({error: "Not Found"})
        } else {
        res.json(results)
        }
    });
});

//search voters matching keyword
app.get('/api/v1/search', (req, res) => {
    //connect database
    const keyword = req.query.q;
    connection.query(`SELECT * FROM voter WHERE name LIKE "%${keyword}%"`, (error, results) => {
        res.json(results)
    });
});

//create a new voter
app.post('/api/v1/voters', async (req,res) => {
    if (!req.body.name || req.body.name === "") {
        res.send({error: "ユーザー名が指定されていません。"})
    } else {
        const name = req.body.name;
        const profile = req.body.profile ? req.body.profile : '';
        const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : '';
    
        //connect database
        await connection.query(`INSERT INTO voter (name, profile, date_of_birth) VALUES ("${name}", "${profile}", "${dateOfBirth}")`)
        res.send({message: "新規ユーザーを作成しました。"})
    }
});

//Update voter data
app.put('/api/v1/voters/:id', async (req,res) => {
    if (!req.body.name || req.body.name === "") {
        res.send({error: "ユーザー名が指定されていません。"})
    } else {
        const id = req.params.id;
        //現在のユーザー情報を取得する
        connection.query(`SELECT * FROM voter WHERE id = ${id}`, async (err, results) => {
            if (!results) {
                res.send({error: "指定されたデータが見つかりません。"})
            } else {
                const name = req.body.name ? req.body.name : results.name;
                const profile = req.body.profile ? req.body.profile : results.profile;
                const dateOfBirth = req.body.date_of_birth ? req.body.date_of_birth : results.date_of_birth;

                //connect database
                await connection.query(`UPDATE voter SET name="${name}", profile="${profile}", date_of_birth="${dateOfBirth}" WHERE id=${id}`)
                res.send({message: "ユーザー情報を更新しました。"})
            }
        })
    }
});

//delete voter data
app.delete('/api/v1/voters/:id', async (req,res) => {
    const id = req.params.id;

    //現在のユーザー情報を取得する
    connection.query(`SELECT * FROM voter WHERE id = ${id}`, async (err, results) => {
        if (!results) {
            res.send({error: "指定されたデータが見つかりません。"})
        }
        //connect database
        await connection.query(`DELETE FROM voter WHERE id=${id}`)
        res.send({message: "ユーザーを削除しました。"})
    })
});

// //get all followers
// app.get('/api/v1/voters/:id/followers', (req, res) => {
//     const id = req.params.id

//     //connect database
//     connection.query(`SELECT * FROM followers LEFT JOIN voters ON followers.followed_id = voters.id WHERE following_id = ${id};`, (err, rows) => {
//         if (!rows) {
//             res.status(404).send({error: "指定されたデータが見つかりません。"})
//         } else {
//             res.status(200).json(rows)
//         }
//     });
// });

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listen on port: ' +  port);