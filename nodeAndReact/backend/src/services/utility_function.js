const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const utility_function = {
    delete_file : async (filename)=>
    {

        const filePath = path.join(__dirname, '../../uploads', req.body.filename);
        console.log(filePath);
        return;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).send('Error deleting file');
          }
          console.log('File deleted successfully');
          res.send('File deleted successfully');
        });
    }
}

export default utility_function;

