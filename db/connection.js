// db.js (ou connection.js)
import mysql from 'mysql2';

// Crie a Pool de conexões UMA ÚNICA VEZ
const pool = mysql.createPool({
    host: 'mna97msstjnkkp7h.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    database: 'go7ffgi5q7wv6e2w',
    user: 'ynbmkshqdbn8vdlb',
    password: 'htka2yqm9yyaz095',
    waitForConnections: true, // Garante que a pool esperará por conexões disponíveis
    connectionLimit: 10,     // Defina o número máximo de conexões na pool
    queueLimit: 0            // 0 significa fila ilimitada de requisições esperando por conexão
});

// Exporte a Pool diretamente para ser usada em outros módulos
export default pool;