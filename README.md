The newly released FileMaker Cloud (https://www.filemaker.com/products/filemaker-cloud/) uses FileMaker IDs for user authentication.
That includes authentication for using the Data API, but with a twist.

The Data API documentation indicates that we need to make the Data API calls using a token.  YOu cannot simply use your FileMaker ID user name and password.

So how do you get such a token?
The help describes how to go about obtaining a token from your FileMaker ID: https://fmhelp.filemaker.com/cloud2/edition/en/customer-console-help/#page/fcc-help%2Fcreate-fmid-token.html

This project is a Node.js web service that makes that whole process easy.  Host the web service internally and call it with a straightforward REST call:


 
