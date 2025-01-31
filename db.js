const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'mysql.railway.internal', // عنوان الخادم (MYSQLHOST)
    user: 'root',                  // اسم المستخدم (MYSQLUSER)
    password: "nfrXyKdTAGHhrrHBVgJLsABqLGahvQAf", // كلمة المرور (MYSQLPASSWORD)
    database: 'railway',           // اسم قاعدة البيانات (MYSQL_DATABASE)
    port: 3306                     // المنفذ (MYSQLPORT)
});

db.connect((err) => {
    if (err) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
    } else {
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    }
});

module.exports = db;
