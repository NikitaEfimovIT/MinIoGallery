import {S3Client} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    endpoint: "http://localhost:9000",
    region: "us-east-1",
    credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin",
    },
    requestChecksumCalculation: "WHEN_REQUIRED",

    forcePathStyle: true,
});

export default s3Client;
