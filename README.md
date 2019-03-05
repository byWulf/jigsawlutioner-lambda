# jigsawlutioner-lambda
## Install
Installation has to be on an `Amazon Linux 2` instance.
### Prerequisites
```bash
nvm install 8
sudo yum install gcc-c++ gcc-4.8.5 python27-2.7.14 awscli
```
See https://github.com/lovell/sharp/issues/879 and https://aws.amazon.com/de/amazon-linux-ami/2018-03-packages/

Configure awscli:
```bash
aws configure
AWS Access Key ID [None]: ...
AWS Secret Access Key [None]: ...
Default region name [None]: eu-central-1
Default output format [None]:
```
Go to https://console.aws.amazon.com/iam/home?region=eu-central-1#/users/byWulf.jigsawlutioner?section=security_credentials and create a new key for Access Key ID and Secret Access Key.

### Compiling
```bash
git clone git@github.com:byWulf/jigsawlutioner-lambda.git
cd jigsawlutioner-lambda
npm install
```

### Pack and upload to S3
```bash
zip -r jigsawlutioner-lambda.zip . -x *.git*
aws s3 cp jigsawlutioner-lambda.zip s3://bywulf.jigsawlutioner.eu-central-1/jigsawlutioner-lambda.zip
```

### Update Lambda endpoints
Go to https://eu-central-1.console.aws.amazon.com/lambda/home?region=eu-central-1 and for each lambda function, do the following:
* **Code input type:** "Upload a file from S3"
* **Runtime:** Node.js 8.10
* **Amazon S3-Link-URL:** https://s3.eu-central-1.amazonaws.com/bywulf.jigsawlutioner.eu-central-1/jigsawlutioner-lambda.zip

After uploading, click the "Test" button to check if it works