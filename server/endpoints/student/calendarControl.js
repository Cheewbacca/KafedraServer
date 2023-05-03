const pool = require("../../mysql");

const calendarControl = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `select subject_name, CONCAT(educator.educator_name, ' ', educator.educator_surname) AS educator_name_surname, calendar_control_1, calendar_control_2 from calendar_control inner join educator on educator.ID_educator = calendar_control.educator_id inner join subjects on subjects.ID_subject = calendar_control.subject_id where student_id = ${id};`;

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

module.exports = calendarControl;
