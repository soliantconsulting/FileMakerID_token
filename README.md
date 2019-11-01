The newly released FileMaker Cloud (https://www.filemaker.com/products/filemaker-cloud/) uses FileMaker IDs for user authentication.
That includes authentication for using the Data API, but with a twist.

The Data API documentation indicates that we need to make the Data API calls using a token.  You cannot simply use your FileMaker ID user name and password. (See the documentation at https://<your server>.account.filemaker-cloud.com/fmi/data/apidoc/#operation/login)

So how do you get that token to include in the header of Data API requests against a FileMaker Cloud server?
The help describes how to go about obtaining a token based on your FileMaker ID: https://fmhelp.filemaker.com/cloud2/edition/en/customer-console-help/#page/fcc-help%2Fcreate-fmid-token.html and the process is not trivial.


This project is a Node.js web service that makes that whole process easy.  Host the web service internally and call it with a straightforward REST call.

The result is



 
