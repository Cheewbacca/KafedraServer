const pool = require("../mysql");

const uploadFile = async (req, res) => {
  try {
    if (!req.files) {
      res.status(403).send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      const image = req.files.img;
      const role = req.body.role;

      image.mv("./uploads/" + image.name);

      pool.getConnection(function (err, connection) {
        const sql = `insert into links(url, namefile, link_role) values('/uploads/${image.name}', "${image.name}", "${role}");`;

        connection.query(sql, function (error, result) {
          if (error) {
            return res.status(500).send(error);
          }

          const { affectedRows } = result;

          pool.releaseConnection(connection);

          if (!Boolean(affectedRows)) {
            return res.status(500).send({ message: "Something was wrong" });
          }

          return res.status(200).send({
            status: true,
            message: "File is uploaded",
            data: {
              name: image.name,
              mimetype: image.mimetype,
              size: image.size,
            },
          });
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = uploadFile;
