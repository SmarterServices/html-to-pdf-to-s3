var AWS = require("aws-sdk");
var pdf = require("pdfcrowd");
var s3Stream = require("s3-upload-stream");
/**
 * pdfPipe Constructor function that sets up a new pdfPipe
 * @param  {[type]} c config object that is required to contain pdfCrowd,can also contain aws stuff
 * @return {object} pdfPipe
 */
var pdfClient = function(c) {
  var config = { region: c.region || "us-east-1" };
  //if aws keys passed in set from the confg
  if (c.accessKey && c.secretKey) {
    config = {
      region: c.region || "us-east-1",
      accessKeyId: c.accessKey,
      secretAccessKey: c.secretKey
    };
    //else if aws keys are set in env var use for config
  } else if (
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ) {
    var config = {
      region: c.region || "us-east-1",
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
  this.client = new pdf.Pdfcrowd(c.pdfCrowd.userName, c.pdfCrowd.apiKey, c.pdfCrowd.hostName || null);
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
      callback(null, true);
    }
  };
}
/**
 * getFunction for code reduction purp, this function is used to return the base function with a small change based on the type
 * @param  {String} type url or html
 * @return {function} function(url,bucket,name,options)
 */
function getFunction(type) {
  return function(url, bucket, name, options) {
    return new Promise((resolve, reject) => {
      //if name does not end in .pdf reject
      if (!name.includes(".pdf")) {
        return reject({ err: "Name passed in must end in .pdf" });
      }
      //else create the writeable stream to s3
      var upload = this.s3.upload({ Bucket: bucket, Key: name });
      //run the pdfCrowd convertURI function and pass out_stream callback with our writable stream and another callback inside it
      //if options run this block
      if (options) {
        //run convertURI or convertHtml based on the type passed into get function
        this.client[type === "url" ? "convertURI" : "convertHtml"](
          url,
          out_stream(
            upload,
            (err, res) => {
              return err ? reject(err) : resolve(res);
            },
            options
          )
        );
      } else {
        //run convertURI or convertHtml based on the type passed into get function
        this.client[type === "url" ? "convertURI" : "convertHtml"](
          url,
          out_stream(upload, (err, res) => {
            return err ? reject(err) : resolve(res);
          })
        );
      }
    });
  };
}
/**
 * [pipeUrl exposed method of the pdfPipe class that takes a a url and pipes it to an s3 bucket
 * @param  {String} url    url that is converted and piped to a s3 bucket
 * @param  {String} bucket bucket the new object is piped to
 * @param  {String} name   name of the output file
 * @return {Promise} resolve or reject
 */
pdfClient.prototype.convertUrl = function(url, bucket, name, options) {
  return getFunction("url").bind(this)(url, bucket, name, options);
};
pdfClient.prototype.convertHtml = function(html, bucket, name, options) {
  return getFunction("html").bind(this)(html, bucket, name, options);
};

module.exports = pdfClient;
