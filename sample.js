var pdfClient = require("./index");
var pdf = new pdfClient({ pdfCrowd: { userName: "username", apiKey: "key" } });
pdf
  .convertUrl("http://google.com", "pdfs-bucket", "url.pdf")
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });

  pdf
    .convertHtml('<strong>Hi</strong>',"pdfs-bucket", "string.pdf")
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
