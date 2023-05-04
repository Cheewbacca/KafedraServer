const pool = require("../../mysql");

const getCurrentControlList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `SELECT subject_name, CONCAT(educator.educator_name, ' ', educator.educator_surname) AS educator_name_surname, resource_name FROM subjects INNER JOIN student_load ON student_load.sub_id = subjects.ID_subject INNER JOIN educator ON educator.ID_educator = subjects.lecturer_id INNER JOIN resource_role ON resource_role.sub_ID = subjects.ID_subject INNER JOIN resources ON resources.ID_resource = resource_role.resource_id WHERE student_load.student_id = ${id} and resource_name LIKE '%_score%' and active = 1 GROUP BY student_load.student_id, subject_name, CONCAT(educator.educator_name, ' ', educator.educator_surname), resource_name;`;

    connection.query(sql, function (error, results) {
      if (error) {
        return res.status(500).send(error);
      }

      const data = results;

      pool.releaseConnection(connection);

      if (!data) {
        return res.status(403).send({ message: "Invalid data" });
      }

      return res.status(200).send({ data });
    });
  });
};

module.exports = getCurrentControlList;
