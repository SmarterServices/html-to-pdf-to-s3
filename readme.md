# html-to-pdf-to-s3

## Installation

``` bash
npm install @smarterservices/html-to-pdf-to-s3 -s
```

## Usage

```bash
let pdfClient = require('@smarterservices/html-to-pdf-to-s3');
let pdf = new pdfClient(config); // config defined below
pdf.convertUrl(url,bucket,name,options)
	.then(console.log)
	.catch(console.log)
```

## Configuration
```json
{
	"accessKey":"aws access key. not required",
	"secretKey":"aws secret key not required",
	"region": "aws region. not required defaults to us-east-1",
	"pdfCrowd": {
		"userName": "pdfCrowd username",
		"apiKey": "pdfCrowd api key",
		"hostName": "pdfCrowd hostname. omit for default."
	}
}
```
> Can use AWS keys in env variable as AWS_ACCESS_KEY_ID
	and AWS_SECRET_ACCESS_KEY

> **NOTE: AWS will use credentials in this order passed in to config > in environment var > with your system profile**

## Methods

### convertUrl(url,bucket,name)

* Arguments
	* `url`: url that will be converted to pdf
	* `bucket`: name of bucket to insert item
	* `name`: name of output item(must end in .pdf)
	* `options`: options object for pdfCrowd.  This is optional.
* Return:
		* resolve or reject of promise

#### Example

```
pdf.convertUrl('http://google.com','testBucket','google.pdf')
	.then(console.log)
	.catch(console.log)
```

### convertHtml(html, bucket, name)
* Arguments
	* `html`: raw html that will be converted
	* `bucket`: name of bucket to insert item
	* `name`: name of output item(must end in .pdf)
	* `options`: options object for pdfCrowd.  This is optional.
* Return:
	* resolve or reject of promise

#### Example
```
pdf.convertHtml('<strong>Hi</strong>','testBucket','google.pdf')
	.then(console.log)
	.catch(console.log)					
```
