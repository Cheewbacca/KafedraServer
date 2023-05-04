const pool = require("../../mysql");

const getSessionList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `select subjects.subject_name, CONCAT(educator.educator_name, ' ', educator.educator_surname) AS educator_name_surname,score, DATE_FORMAT(exam_date, "%Y %m %d") from exams inner join educator on educator.ID_educator = exams.educator_id inner join subjects on subjects.ID_subject = exams.sub_id inner join students on students.ID_student = exams.student_id where ID_student = ${id} and active = 1;`;

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

module.exports = getSessionList;
