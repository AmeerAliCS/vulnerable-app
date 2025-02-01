const express = require("express");
const mysql = require("mysql2"); // استخدام مكتبة mysql2
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد الاتصال بقاعدة البيانات باستخدام متغيرات البيئة
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'nfrXyKdTAGHhrrHBVgJLsABqLGahvQAf',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    multipleStatements: true, // تمكين الاستعلامات المتعددة
    connectTimeout: 10000, // تعيين مهلة الاتصال إلى 10 ثوانٍ
});

// التحقق من الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error("❌ خطأ في الاتصال بقاعدة البيانات:", err);
        process.exit(1); // إنهاء الخادم في حالة وجود خطأ في الاتصال
    } else {
        console.log("✅ تم الاتصال بقاعدة البيانات بنجاح!");
    }
});

// المحافظة على الاتصال بقاعدة البيانات
setInterval(() => {
    db.query("SELECT 1", (err) => {
        if (err) {
            console.error("⚠️ فقد الاتصال بقاعدة البيانات:", err);
        }
    });
}, 60000); // كل دقيقة

// 1. **ثغرة SQL Injection** - تسجيل الدخول
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // استعلام SQL غير آمن (للتجربة فقط)
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        console.log("Executing Query:", query); // طباعة الاستعلام لمتابعة التنفيذ

        db.query(query, (err, results) => {
            if (err) {
                console.error("❌ خطأ في تنفيذ الاستعلام:", err);
                return res.status(500).send("⚠️ خطأ في السيرفر");
            }
            if (results.length > 0) {
                return res.send("✅ تم تسجيل الدخول بنجاح!");
            } else {
                return res.send("❌ اسم المستخدم أو كلمة المرور غير صحيحة");
            }
        });
    } catch (error) {
        console.error("❌ خطأ غير متوقع:", error);
        res.status(500).send("⚠️ حدث خطأ في السيرفر");
    }
});

// 2. **ثغرة XSS** - التعليقات
const comments = [];

app.post("/comment", (req, res) => {
    try {
        const { comment } = req.body;
        console.log("Received Comment:", comment); // طباعة التعليق المدخل
        comments.push(comment);
        res.send("✅ تم إضافة التعليق بنجاح!");
    } catch (error) {
        console.error("❌ خطأ أثناء إضافة التعليق:", error);
        res.status(500).send("⚠️ حدث خطأ في السيرفر");
    }
});

app.get("/comments", (req, res) => {
    res.send(comments);
});

// 3. **ثغرة التخمين على كلمات المرور (Brute Force)**
app.post("/brute-force", async (req, res) => {
    try {
        const { username, password } = req.body;

        // استعلام SQL غير آمن
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        console.log("Executing Brute Force Query:", query);

        db.query(query, (err, results) => {
            if (err) {
                console.error("❌ خطأ في تنفيذ الاستعلام:", err);
                return res.status(500).send("⚠️ خطأ في السيرفر");
            }
            if (results.length > 0) {
                return res.send("✅ تم تسجيل الدخول بنجاح!");
            } else {
                return res.send("❌ خطأ في تسجيل الدخول!");
            }
        });
    } catch (error) {
        console.error("❌ خطأ غير متوقع:", error);
        res.status(500).send("⚠️ حدث خطأ في السيرفر");
    }
});

// تشغيل الخادم
const PORT = process.env.PORT || 8080; // استخدم المنفذ الصحيح
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
});

