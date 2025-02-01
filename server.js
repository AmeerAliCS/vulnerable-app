const express = require("express");
const mysql = require("mysql2"); // استخدام مكتبة mysql2 بدلاً من mysql
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'mysql.railway.internal', // MYSQLHOST
    user: 'root',                  // MYSQLUSER
    password: 'nfrXyKdTAGHhrrHBVgJLsABqLGahvQAf', // MYSQLPASSWORD
    database: 'railway',           // MYSQLDATABASE
    port: 3306                     // MYSQLPORT
  });

db.connect((err) => {
  if (err) {
    console.error("خطأ في الاتصال بقاعدة البيانات:", err);
  } else {
    console.log("تم الاتصال بقاعدة البيانات بنجاح!");
  }
});

// 1. **ثغرة SQL Injection** - تسجيل الدخول
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // استعلام SQL غير آمن
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log("Executing Query:", query); // طباعة الاستعلام لمتابعة التنفيذ

  db.query(query, (err, results) => {
    if (err) {
      console.error("خطأ في تنفيذ الاستعلام:", err);
      return res.status(500).send("خطأ في السيرفر");
    }
    if (results.length > 0) {
      return res.send("تم تسجيل الدخول بنجاح!");
    } else {
      return res.send("اسم المستخدم أو كلمة المرور غير صحيحة");
    }
  });
});

// 2. **ثغرة XSS** - التعليقات
const comments = [];

app.post("/comment", (req, res) => {
  const { comment } = req.body;

  // الكود غير آمن، يتم تخزين الإدخال بدون تصفية
  console.log("Received Comment:", comment); // طباعة التعليق المدخل
  comments.push(comment);

  res.send("تم إضافة التعليق بنجاح!");
});

app.get("/comments", (req, res) => {
  res.send(comments);
});

// 3. **ثغرة التخمين على كلمات المرور (Brute Force)**
app.post("/brute-force", (req, res) => {
  const { username, password } = req.body;

  // بدون أي تحقق أو تأخير، مما يسمح بالتخمين بسهولة
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log("Executing Brute Force Query:", query); // طباعة الاستعلام لمتابعة التنفيذ

  db.query(query, (err, results) => {
    if (err) {
      console.error("خطأ في تنفيذ الاستعلام:", err);
      return res.status(500).send("خطأ في السيرفر");
    }
    if (results.length > 0) {
      return res.send("تم تسجيل الدخول بنجاح!");
    } else {
      return res.send("خطأ في تسجيل الدخول!");
    }
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000; // استخدام المنفذ من متغيرات البيئة أو الافتراضي 3000
app.listen(PORT, () => {
  console.log("الخادم يعمل على http://localhost:3000");
});
