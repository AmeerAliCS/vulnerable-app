const mysql = require('mysql');

// إعداد الاتصال باستخدام المتغيرات من Railway
const db = mysql.createConnection({
    host: 'mysql.railway.internal', // MYSQLHOST
    user: 'root',                  // MYSQLUSER
    password: 'nfrXyKdTAGHhrrHBVgJLsABqLGahvQAf', // MYSQLPASSWORD
    database: 'railway',           // MYSQLDATABASE
    port: 3306                     // MYSQLPORT
});

// الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err);
    } else {
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    }
});

module.exports = db;
