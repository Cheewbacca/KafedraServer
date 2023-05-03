const pool = require("../../mysql");

const controlStudent = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `Select ID_math_score, CONCAT(students.student_name, ' ', students.student_surname) AS student_name_surname, score_date, score,type_of_control from math_score inner join students on students.ID_student = math_score.student_id where student_id = ${id};`;

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

module.exports = controlStudent;
