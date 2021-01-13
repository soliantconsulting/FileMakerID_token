Claris FileMaker Cloud (https://help.claris.com/en/cloud-help/) uses Claris IDs for user authentication.
That includes authentication for using the Data API, but with a twist.

The Data API documentation indicates that we need to make the Data API calls using a token.  You cannot simply use your Claris ID user name and password. (See the documentation at https://<<<<your_FMC_server>>>>.account.filemaker-cloud.com/fmi/data/apidoc/#operation/login)

So how do you get that token to include in the header of Data API requests against a FileMaker Cloud server?
The help describes how to go about obtaining a token based on your Claris ID: https://help.claris.com/en/customer-console-help/content/create-fmid-token.html and the process is not trivial.

This project is a Node.js web service that makes that whole process easy.  Host the web service internally and call it with a straightforward REST call.

For a full walkthrough see: https://www.soliantconsulting.com/blog/data-api-filemaker-cloud/



 
