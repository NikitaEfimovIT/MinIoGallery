import s3Client from "./aws.js";
import {DeleteObjectCommand , GetObjectCommand , ListObjectsV2Command , PutObjectCommand} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = "test"

export const getImages = async (setImageKeys, setSignedUrls) => {

    try {
        const listResp = await s3Client.send(
            new ListObjectsV2Command({Bucket : BUCKET_NAME})
        );
        const keys = listResp.Contents?.map((obj) => obj.Key) || [];
        //Updating our local state of keys
        setImageKeys(keys);

        const urlMap = {};
        await Promise.all(
            keys.map(async (key) => {
                const getCmd = new GetObjectCommand({Bucket : BUCKET_NAME , Key : key});
                urlMap[key] = await getSignedUrl(s3Client , getCmd , {expiresIn : 3600});
            })
        );
        //Updating our local state of urls that we can use to get image and show it on teh webpage

        setSignedUrls(urlMap)
    } catch (err) {
        console.log("Error with getting all images: ", err)
    }
}

export const deleteImage = async (key, setImageKeys, setSignedUrls) => {
    try {
        await s3Client.send(
            new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: key })
        );
        //Updating our local state
        setImageKeys((prev) => prev.filter((k) => k !== key));
        setSignedUrls((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

export const putFile = async(e, existingKey=null, setImageKeys, setSignedUrls)=>{
    const file = e.target.files[0];
    if (!file) return;
    console.log(file)
    // If existingKey is provided, we overwrite that object; else use file.name
    const objectKey = existingKey || file.name;
    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: objectKey,
                Body: file,
                ContentType: file.type,
            })
        );
        console.log("successfully send")

        // Update local state
        setImageKeys((prev) => {
            if (prev.includes(objectKey)) return prev;
            return [...prev, objectKey];
        });

        // Regenerate URL
        const getCmd = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: objectKey,
        });
        const url = await getSignedUrl(s3Client, getCmd, { expiresIn: 3600 });
        setSignedUrls((prev) => ({ ...prev, [objectKey]: url }));
    } catch (err) {
        console.error("Upload/Overwrite failed:", err);
    }
}

