const pool = require("../../mysql");

const getCurrentControlList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const backslash = "%\\\\%";

    console.log(backslash);

    const sql =
      "SET @v_sql = ''; SELECT Concat(@v_sql, 'SELECT TableName, subject_name, educator_name_surname FROM ( SELECT SUBSTRING('', t.TABLE_SCHEMA, '.', t.TABLE_NAME , '" +
      backslash +
      "', 5, 1000) AS TableName, subjects.subject_name, CONCAT(educator.educator_name, " +
      backslash +
      "' " +
      backslash +
      "', educator.educator_surname) AS educator_name_surname FROM `', t.TABLE_SCHEMA, '`.`', t.TABLE_NAME, '` INNER JOIN subjects ON `', t.TABLE_SCHEMA, '`.`', t.TABLE_NAME, '`.subject_id = subjects.ID_subject INNER JOIN educator ON subjects.lecturer_id = educator.ID_educator WHERE student_id = " +
      id +
      " ) sub GROUP BY TableName, subject_name, educator_name_surname UNION ALL ') INTO @v_sql FROM INFORMATION_SCHEMA.TABLES t INNER JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME AND t.TABLE_SCHEMA = c.TABLE_SCHEMA WHERE c.COLUMN_NAME = 'student_id'; SET @v_sql = LEFT(@v_sql, CHAR_LENGTH(RTRIM(@v_sql)) - 10); SET @stmt_str = @v_sql; PREPARE stmt FROM @stmt_str; EXECUTE stmt; DEALLOCATE PREPARE stmt;";

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

module.exports = getCurrentControlList;
