const pool = require("../../mysql");
const getPermissions = require("../helpers/getRights");

const updateCalendar = (req, res) => {
  const { note1, note2, control_id, educator_id } = req.query || {};

  if (!educator_id || !note1 || !control_id || !note2) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  getPermissions("can_edit", educator_id, "calendar_control")
    .then((canView) => {
      if (!canView) {
        return res.status(403).send({ message: "Invalid permissions" });
      }

      pool.getConnection(function (err, connection) {
        const sql = `UPDATE calendar_control SET calendar_control_1 = ${decodeURI(
          note1
        )}, calendar_control_2 = ${decodeURI(
          note2
        )} WHERE ID_control = ${control_id};`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const { changedRows } = result;

          pool.releaseConnection(connection);

          if (Boolean(changedRows)) {
            return res.status(200).send({ success: true });
          }

          return res.status(500).send({ message: "Something was bad" });
        });
      });
    })
    .catch((err) => {
      return res.status(403).send({ message: err });
    });
};

module.exports = updateCalendar;
