import cors from "cors";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  ref,
  uploadString,
  getStorage,
  listAll,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: "scrole-p5.firebaseapp.com",
  projectId: "scrole-p5",
  storageBucket: "scrole-p5.appspot.com",
  messagingSenderId: "604869933835",
  appId: "1:604869933835:web:ec6ebab85fc8edfe29400e",
  measurementId: "G-BG3VC8RZV7",
};

// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);

/* 1. expressモジュールをロードし、インスタンス化してappに代入。*/
import express from "express";
let app = express();

/* 2. listen()メソッドを実行して3000番ポートで待ち受け。*/
let server = app.listen(3000, () => {
  console.log("Node.js is listening to PORT:" + server.address().port);
});

/* 3. 以後、アプリケーション固有の処理 */
app.use(
  cors({
    origin: "http://localhost:5000", //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);
app.use(bodyParser.json());
const storage = getStorage();
app.post("/:stage", (req, res, next) => {
  const storageRef = ref(storage, req.params.stage + "/" + uuidv4() + ".png");
  const base_content = req.body.base.split(",")[1];
  uploadString(storageRef, base_content, "base64").then((snapshot) => {
  });
});
app.get("/:stage_path", (req, res, next) => {
  const listref = ref(storage, req.params.stage_path + "/");
  listAll(listref).then((res_list) => {
    let image_count = 0;
    const url_list = [];
    res_list.items.forEach((itemRef) => {
      const imageref = ref(storage, itemRef);

      getDownloadURL(imageref).then((url) => {
        image_count++;
        url_list.push(url);
        if (image_count === res_list.items.length || image_count == 10) {
          res.json({ urls: url_list });
        }
      });
    });
  });
});
