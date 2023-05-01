const pool = require("../mysql");

const login = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(403).send(new Error("Some field is missing"));
  }

  pool.getConnection(function (err, connection) {
    const sql =
      "SELECT COUNT(*) as count, role_name, CASE WHEN roles.role_name = 'student' THEN students.student_name WHEN roles.role_name = 'educator' THEN educator.educator_name WHEN roles.role_name = 'methodist' THEN educator.educator_name WHEN roles.role_name = 'admin' THEN educator.educator_name END AS name, CASE WHEN roles.role_name = 'student' THEN students.student_surname WHEN roles.role_name = 'educator' THEN educator.educator_surname WHEN roles.role_name = 'methodist' THEN educator.educator_surname WHEN roles.role_name = 'admin' THEN educator.educator_surname END AS surname, CASE WHEN roles.role_name = 'student' THEN students.student_patronymic WHEN roles.role_name = 'educator' THEN educator.educator_patronymic WHEN roles.role_name = 'methodist' THEN educator.educator_patronymic WHEN roles.role_name = 'admin' THEN educator.educator_patronymic END AS patronymic, CASE WHEN roles.role_name = 'student' THEN `groups`.group_name WHEN roles.role_name = 'educator' THEN NULL WHEN roles.role_name = 'methodist' THEN NULL WHEN roles.role_name = 'admin' THEN NULL END AS group_name, CASE WHEN roles.role_name = 'student' THEN students.ID_student WHEN roles.role_name = 'educator' THEN educator.ID_educator WHEN roles.role_name = 'methodist' THEN educator.ID_educator WHEN roles.role_name = 'admin' THEN educator.ID_educator END AS id FROM auth LEFT JOIN user_role ON user_role.auth_id = auth.ID_auth LEFT JOIN students ON students.auth_id = auth.ID_auth LEFT JOIN educator ON educator.auth_id = auth.ID_auth LEFT JOIN `groups` ON `groups`.ID_group = students.group_id INNER JOIN roles ON roles.ID_roles = user_role.role_id WHERE auth.user_login ='" +
      login +
      "' AND auth.user_password = '" +
      password +
      "' GROUP BY role_name, CASE WHEN roles.role_name = 'student' THEN students.student_name WHEN roles.role_name = 'educator' THEN educator.educator_name WHEN roles.role_name = 'methodist' THEN educator.educator_name WHEN roles.role_name = 'admin' THEN educator.educator_name END, CASE WHEN roles.role_name = 'student' THEN students.student_surname WHEN roles.role_name = 'educator' THEN educator.educator_surname WHEN roles.role_name = 'methodist' THEN educator.educator_surname WHEN roles.role_name = 'admin' THEN educator.educator_surname END, CASE WHEN roles.role_name = 'student' THEN students.student_patronymic WHEN roles.role_name = 'educator' THEN educator.educator_patronymic WHEN roles.role_name = 'methodist' THEN educator.educator_patronymic WHEN roles.role_name = 'admin' THEN educator.educator_patronymic END, CASE WHEN roles.role_name = 'student' THEN `groups`.group_name WHEN roles.role_name = 'educator' THEN NULL WHEN roles.role_name = 'methodist' THEN NULL WHEN roles.role_name = 'admin' THEN NULL END, CASE WHEN roles.role_name = 'student' THEN students.ID_student WHEN roles.role_name = 'educator' THEN educator.ID_educator WHEN roles.role_name = 'methodist' THEN educator.ID_educator WHEN roles.role_name = 'admin' THEN educator.ID_educator END";

    connection.query(sql, function (error, results) {
      if (error) {
        return res.status(500).send(error);
      }

      const [data] = results;

      if (!data) {
        return res.status(403).send({ message: "Invalid data" });
      }

      return res.status(200).send({ data });
    });
  });
};

module.exports = login;
