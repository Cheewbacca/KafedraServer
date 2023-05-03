const pool = require("../../mysql");

const getEducatorCurrentControlList = (req, res) => {
  const { id } = req.query || {};

  if (!id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql = `SELECT ID_subject, subject_name, group_name, resource_name  FROM subjects INNER JOIN resource_role ON resource_role.sub_ID = subjects.ID_subject INNER JOIN resources ON resources.ID_resource = resource_role.resource_id INNER JOIN groupss ON groupss.ID_group = subjects.group_id WHERE (lecturer_id = ${id} OR assistant_id = ${id}) AND resource_name LIKE '%_score%' GROUP BY ID_subject, subject_name, group_name, resource_name;`;

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

module.exports = getEducatorCurrentControlList;
