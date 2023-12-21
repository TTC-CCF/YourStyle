import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';

const S3params = { 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY 
    }
};

function getImageKey(url) {
    let url_split = url.split('/');
    return `${process.env.AWS_S3_KEY}/${url_split[url_split.length - 1]}`;
}

async function RemoveS3Images(image_key) {
    if (image_key === undefined ) return;
    console.log(image_key)
    const s3Client = new S3Client(S3params);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image_key
      };
    const command = new DeleteObjectCommand(params);
    const response = await s3Client.send(command);

    if (response.$metadata.httpStatusCode !== 204) {
        console.log(response);
        throw new Error();
    }
}

async function uploadImageToS3(file) {
    if (file === undefined) return;

    const s3Client = new S3Client(S3params);
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${process.env.AWS_S3_KEY}/${file.filename}`,
        Body: fs.readFileSync(file.path),
        ContentType: file.mimetype,
        
    });

    const response = await s3Client.send(command);
    if (response.$metadata.httpStatusCode !== 200) {
        throw new Error();
    }
    
    return `${process.env.AWS_CDN_URL}/${process.env.AWS_S3_KEY}/${file.filename}`
}

export { RemoveS3Images, uploadImageToS3, getImageKey };