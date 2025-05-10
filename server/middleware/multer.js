const multer = require('multer');
const { Readable } = require('stream');

const storage = multer.memoryStorage(); // store file in memory

const upload = multer({ storage });

const bufferToStream = (buffer) => {
  return Readable.from(buffer);
};

module.exports = {
    upload,
    bufferToStream,
};
