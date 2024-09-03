const fs = require("fs");
// fs.writeFile('./test.txt','hello world i am sanjit',(err)=>{
//     if(!err)
//     {
//         console.log("file created successfully");
//     }
// });

// fs.readFile("./test.txt", 'utf-8', (err, result) => {
//     if (err) {
//         console.log(err);
//     }else{
//         console.log(result);
//     }
// })

// fs.appendFileSync("./test.txt","\nhey i am sanjit");
// fs.unlinkSync("./test.js")

console.log(fs.statSync("./test.txt").isFile());