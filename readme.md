html-to-pdf-to-s3
=======
Install & start
	
	npm install pdf-pipe -s	
	
	
	
	let pdfPipe = require('html-to-pdf-to-s3')
	let pdf = new pdfPipe(config //explained below)
	pdf.pipeUrl(url,bucket,name,options)
		.then(console.log)
		.catch(console.log)
	
	
config for constructor: 

	{
		accessKey:aws access key, //not required
		secretKey:aws secret key, //not required
		region: aws region, // not required defaults to us-east-1
		pdfCrowd: {
			userName: pdfCrowd username,
			apiKey: pdfCrowd api key
		}
	}	
	
	//can have aws keys in env variable as AWS_ACCESS_KEY_ID
	and AWS_SECRET_ACCESS_KEY

**NOTE: aws will use creds in this order passed in to config > in enviroment var > with your system profile**


method:

	convertUrl(url,bucket,name) //Promise
		args:
			url: url that will be converted to pdf
			bucket: name of bucket to insert item
			name: name of output item(must end in .pdf)
			options: options object for pdfCrowd //check their readme it is optional
			
		return:
				resolve or reject of promise
				
		example:
		
			pdf.pipeUrl('http://google.com','testBucket','google.pdf')
				.then(console.log)
				.catch(console.log)	
				
				
====				
		convertHtml(html,bucket,name) //Promise
		args:
			html: raw html that will be converted
			bucket: name of bucket to insert item
			name: name of output item(must end in .pdf)
			options: options object for pdfCrowd //check their readme it is optional
			
		return:
				resolve or reject of promise
				
		example:
		
			pdf.pipeUrl('http://google.com','testBucket','google.pdf')
				.then(console.log)
				.catch(console.log)					