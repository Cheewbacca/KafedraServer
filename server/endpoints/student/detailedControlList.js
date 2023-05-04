const pool = require("../../mysql");

const detailedControlList = (req, res) => {
  const { id, resource } = req.query || {};

  if (!id || !resource) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `Select DISTINCT DATE_FORMAT(score_date, "%Y %m %d"), CONCAT(educator.educator_name, ' ', educator.educator_surname) AS educator_name_surname, score, type_of_control from ${resource} inner join subjects on subjects.ID_subject = ${resource}.subject_id inner join educator on ${resource}.educator_id = educator.ID_educator where student_id=${id};`;

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

module.exports = detailedControlList;
