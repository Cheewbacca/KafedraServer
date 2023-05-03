const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const updateCalendar = (req, res) => {
  const { note, control_id, educator_id } = req.query || {};

  if (!educator_id || !note || !control_id) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  getPermissions("can_edit", educator_id, "calendar_control")
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `UPDATE calendar_control SET calendar_control_1 = '${note}' WHERE ID_control = ${control_id};`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const { changedRows } = result;

          if (Boolean(changedRows)) {
            return res.status(200).send({ success: true });
          }

          return res.status(500).send({ message: "Something was bad" });
        });

        pool.releaseConnection(connection);
      });
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = updateCalendar;
