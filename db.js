const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost', // عنوان الخادم
    user: 'root',      // اسم المستخدم
    password: "123456", // كلمة المرور
    database: 'vulnerable_db'  // اسم قاعدة البيانات
});

db.connect((err) => {
    if (err) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
    } else {
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    }
});

module.exports = db;
