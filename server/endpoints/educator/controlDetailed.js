const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const controlDetailed = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  getPermissions("can_view", id)
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `Select DISTINCT student_id, CONCAT(students.student_name, ' ', students.student_surname) as student_name_surname, group_name from math_score inner join students on students.ID_student = math_score.student_id inner join groupss on groupss.ID_group = students.group_id;`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const data = result;

          if (!data) {
            return res.status(403).send({ message: "Score did not changed" });
          }

          return res.status(200).send({ data });
        });
      });
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = controlDetailed;
