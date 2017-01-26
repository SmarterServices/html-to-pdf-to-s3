var pdfClient = require("./index");
var pdf = new pdfClient({ pdfCrowd: { userName: "", apiKey: "" } });
pdf
  .convertUrl("http://google.com", {"bucket": "pdfs", "key": "url.pdf", "expires": 500})
  .then(res => {
    console.log(res);
  })
  .catch(e => {
    console.log(e);
  });

  pdf
    .convertHtml('<strong>Hi</strong>',{"bucket": "pdfs", "key": "url.pdf"})
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(e);
    });
