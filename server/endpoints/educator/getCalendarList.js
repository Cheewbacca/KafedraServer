const pool = require("../../mysql");

const getCalendarList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `select DISTINCT subject_name, group_name, resource_name  from calendar_control inner join educator on educator.ID_educator = calendar_control.educator_id inner join subjects on subjects.ID_subject = calendar_control.subject_id inner join students on students.ID_student = calendar_control.student_id inner join groupss on groupss.ID_group = subjects.group_id INNER JOIN resource_role ON resource_role.sub_ID = subjects.ID_subject INNER JOIN resources ON resources.ID_resource = resource_role.resource_id where ID_educator = ${id}  and resource_name LIKE '%calendar_control%';`;

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

module.exports = getCalendarList;
