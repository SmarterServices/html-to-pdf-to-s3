var pdfPipe = require("./index");
var pdf = new pdfPipe({ pdfCrowd: { userName: "", apiKey: "" } });
pdf
  .pipeUrl("http://google.com", "testBucket", "test.pdf")
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });
