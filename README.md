Claris FileMaker Cloud (https://help.claris.com/en/cloud-help/) uses Claris IDs for user authentication.
That includes authentication for using the Data API, but with a twist.

The Data API documentation indicates that we need to make the Data API calls using a token.  You cannot simply use your Claris ID user name and password. (See the documentation at https://<<<<your_FMC_server>>>>.account.filemaker-cloud.com/fmi/data/apidoc/#operation/login)

So how do you get that token to include in the header of Data API requests against a FileMaker Cloud server?
The help describes how to go about obtaining a token based on your Claris ID: https://help.claris.com/en/customer-console-help/content/create-fmid-token.html and the process is not trivial.

This project is a Node.js Express web service that makes that whole process easy.  Host the web service internally and call it with a straightforward REST call.

Running this web service as a background process can be done with tools such as PM2
(see http://expressjs.com/en/advanced/pm.html)
Since this version does not do SSL termination, you can deploy this behind a reverse proxy to take care of SSL and forward the traffic to this service.

For a full walkthrough see: https://www.soliantconsulting.com/blog/data-api-filemaker-cloud/



 
