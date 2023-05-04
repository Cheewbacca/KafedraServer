const pool = require("../../mysql");

/**
 * Function to get educator permission
 * @param {number} id - educator id
 * @returns {boolean} can view
 */
const getPermissions = (field, id, resource = "math_score") => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      const getPermissionsQuery = `Select ${field} from subjects INNER JOIN resource_role ON resource_role.sub_ID = subjects.ID_subject INNER JOIN resources ON resources.ID_resource = resource_role.resource_id inner join user_role on user_role.ID_role = resource_role.role_id inner join auth on auth.ID_auth = user_role.auth_id inner join educator on auth.ID_auth = educator.auth_id where resource_name = "${resource}" and ID_educator = ${id};`;

      connection.query(getPermissionsQuery, function (error, permissions) {
        if (error) {
          return reject(error);
        }

        pool.releaseConnection(connection);

        const [rights] = permissions;

        canView = Boolean(rights[field]);

        return resolve(canView);
      });
    });
  });
};

module.exports = getPermissions;
