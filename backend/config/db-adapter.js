// Database adapter to handle both MySQL and PostgreSQL
const dbConfig = process.env.DATABASE_URL 
    ? require('./database-postgres')
    : require('./database');

// Export pool for direct queries
const pool = dbConfig.pool;

// Wrapper for query execution that works with both databases
async function query(sql, params = []) {
    if (process.env.DATABASE_URL) {
        // PostgreSQL - convert MySQL placeholders (?) to PostgreSQL ($1, $2, etc.)
        let pgSql = sql;
        let paramIndex = 1;
        while (pgSql.includes('?')) {
            pgSql = pgSql.replace('?', `$${paramIndex}`);
            paramIndex++;
        }
        
        // Execute PostgreSQL query
        const result = await pool.query(pgSql, params);
        // Return in MySQL2 format [rows, fields]
        return [result.rows, result.fields];
    } else {
        // MySQL
        return await pool.query(sql, params);
    }
}

module.exports = {
    pool,
    query
};
