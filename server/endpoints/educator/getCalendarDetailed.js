const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const getCalendarDetailed = (req, res) => {
  const { group, educator_id } = req.query || {};

  if (!educator_id || !group) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  getPermissions("can_view", educator_id, "calendar_control")
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `select ID_control, CONCAT(students.student_name, ' ', students.student_surname) AS student_name_surname, group_name, calendar_control_1, calendar_control_2 from calendar_control inner join educator on educator.ID_educator = calendar_control.educator_id inner join subjects on subjects.ID_subject = calendar_control.subject_id inner join students on students.ID_student = calendar_control.student_id inner join groupss on groupss.ID_group = students.group_id where groupss.group_name = '${group}';`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const data = result;

          if (!data) {
            return res.status(403).send({ message: "Invalid data" });
          }

          return res.status(200).send({ data });
        });

        pool.releaseConnection(connection);
      });
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = getCalendarDetailed;
