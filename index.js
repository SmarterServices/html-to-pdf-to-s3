var AWS = require("aws-sdk");
var pdf = require("pdfcrowd");
var s3Stream = require("s3-upload-stream");
/**
 * pdfPipe Constructor function that sets up a new pdfPipe 
 * @param  {[type]} c config object that is required to contain pdfCrowd,can also contain aws stuff
 * @return {object} pdfPipe
 */
var pdfPipe = function(c) {
  var config = { region: c.region||"us-east-1" };
  //if aws keys passed in set from the confg
  if (c.accessKey && c.secretKey) {
    config = {
      region: c.region||"us-east-1",
      accessKeyId: c.accessKey,
      secretAccessKey: c.secretKey
    };
    //else if aws keys are set in env var use for config
  } else if (
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ) {
    var config = {
      region: c.region||"us-east-1",
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    };
  }
  //if no pdfCrowd keys throw error
  if (!c.pdfCrowd || !c.pdfCrowd.userName || !c.pdfCrowd.apiKey) {
    throw new Error(
      "Missing pdfCrowd username or apikey in config, check readme for example"
    );
  }
  //initalize both clients that are attached to this pdfPipe instance
  this.client = new pdf.Pdfcrowd(c.pdfCrowd.userName, c.pdfCrowd.apiKey);
  this.s3 = require("s3-upload-stream")(new AWS.S3(config));
};

/**
 * out_stream this is a private function that is used as the callback for the convertURI function below
 * @param  {stream}   wStream  the writable stream that the pdf will pipe to
 * @param  {Function} callback callback that chains all the way out the the exposed method
 * @return {callback} callback(err,result)
 */
function out_stream(wStream, callback) {
  return {
    //pipe the pdf that is rstream to the wstream(s3 writable stream)
    pdf: function(rstream) {
      rstream.pipe(wStream);
    },
    //if an error happens during pipe bubble the error message up
    error: function(errMessage, statusCode) {
      callback("ERROR: " + errMessage, null);
    },
    //called at the end of the stream
    end: function() {
      callback(null, { ended: true });
    }
  };
}
/**
 * [pipeUrl exposed method of the pdfPipe class that takes a a url and pipes it to an s3 bucket
 * @param  {String} url    url that is converted and piped to a s3 bucket
 * @param  {String} bucket bucket the new object is piped to
 * @param  {String} name   name of the output file
 * @return {Promise} resolve or reject
 */
pdfPipe.prototype.pipeUrl = function(url, bucket, name) {
  return new Promise((resolve, reject) => {
    //if name does not end in .pdf reject
    if (!name.includes(".pdf")) {
      return reject({ err: "Name passed in must end in .pdf" });
    }
    //else create the writeable stream to s3
    var upload = this.s3.upload({ Bucket: bucket, Key: name });
    //run the pdfCrowd convertURI function and pass out_stream callback with our writable stream and another callback inside it
    this.client.convertURI(
      url,
      out_stream(upload, (err, res) => {
        return err ? reject(err) : resolve(res);
      })
    );
  });
};

module.exports = pdfPipe;
