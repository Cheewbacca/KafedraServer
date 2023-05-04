const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const getSessionsGroup = (req, res) => {
  const { group, educator_id } = req.query || {};

  if (!group || !educator_id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  getPermissions("can_view", educator_id, "exams")
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `select ID_student_exam, CONCAT(students.student_name, ' ', students.student_surname) AS student_name_surname, group_name, score from exams inner join educator on educator.ID_educator = exams.educator_id inner join subjects on subjects.ID_subject = exams.sub_id inner join students on students.ID_student = exams.student_id inner join groupss on groupss.ID_group = students.group_id where groupss.group_name = '${group}';`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const data = result;

          pool.releaseConnection(connection);

          if (!data) {
            return res.status(403).send({ message: "Something went wrong" });
          }

          return res.status(200).send({ data });
        });
      });
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = getSessionsGroup;
