const { Upload } = require("@aws-sdk/lib-storage");
const { S3 } = require("@aws-sdk/client-s3");
const uuid = require("uuid").v4;

exports.S3Uploadv3 = async (file, folder) => {
    console.log("S3 =>", folder, file);
    const s3 = new S3({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID
        }
    });

    const param = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${folder}/${uuid()}-${file.originalname}`,
        Body: file.buffer
    };

    return await new Upload({
        client: s3,
        params: param
    }).done();
};