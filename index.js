var pdfPipe = require("./index");
var pdf = new pdfPipe({
  pdfCrowd: {
    userName: "",
    apiKey: ""
  }
});

pdf
  .convertUrl(
    "http://google.com", 
    "TestBucket", 
    "testUrl.pdf")
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });
  //or
pdf
  .convertHtml(
    "<html>regular HTML code</html>",
    "TestBucket",
    "testHtml.pdf"
  )
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });
