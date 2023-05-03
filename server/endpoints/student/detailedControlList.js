const pool = require("../../mysql");

const detailedControlList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `Select DISTINCT score_date, CONCAT(educator.educator_name, ' ', educator.educator_surname) AS educator_name_surname, score, type_of_control from math_score inner join subjects on subjects.ID_subject = math_score.subject_id inner join educator on math_score.educator_id = educator.ID_educator where student_id=${id};`;

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

module.exports = detailedControlList;
