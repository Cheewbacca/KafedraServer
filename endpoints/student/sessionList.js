const pool = require("../../mysql");

const getSessionList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `SET @sql = ''; SELECT @sql := CONCAT(@sql, 'SELECT TableName, subject_name, educator_name_surname, score FROM ( SELECT SUBSTRING(''', t.TABLE_NAME, ''', 1, 1000) AS TableName, subjects.subject_name,  CONCAT(educator.educator_name, '' '', educator.educator_surname) AS educator_name_surname,CASE WHEN c.COLUMN_NAME = ''score'' THEN ', t.TABLE_NAME, '.score ELSE NULL END AS score  FROM ', t.TABLE_SCHEMA, '.', t.TABLE_NAME, '  INNER JOIN subjects ON ', t.TABLE_SCHEMA, '.', t.TABLE_NAME, '.subject_id = subjects.ID_subject  INNER JOIN educator ON subjects.lecturer_id = educator.ID_educator INNER JOIN INFORMATION_SCHEMA.COLUMNS c ON ', t.TABLE_SCHEMA, '.', t.TABLE_NAME, '.', c.COLUMN_NAME, ' = ', c.COLUMN_NAME, '  WHERE exam_student_id = ${id} AND c.COLUMN_NAME IN (''score'') ) sub GROUP BY TableName, subject_name, educator_name_surname, score UNION ALL ') FROM INFORMATION_SCHEMA.TABLES t INNER JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA WHERE c.COLUMN_NAME = 'exam_student_id'; SET @sql = LEFT(@sql, LENGTH(@sql) - 10); PREPARE stmt FROM @sql; EXECUTE stmt;`;

    connection.query(sql, function (error, results) {
      if (error) {
        return res.status(500).send(error);
      }

      const data = results;

      if (!data) {
        return res.status(403).send({ message: "Invalid data" });
      }

      return res.status(200).send({ data });
    });
  });
};

module.exports = getSessionList;
