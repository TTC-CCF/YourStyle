import base64 from 'base64-js';

export default class RemoveBg { 
    static async removeBackground(image) {
        console.log("removeBackground")
        const formdata = new FormData();

        formdata.append("image_file", {
            uri: image,
            type: `image/png`,
            name: `image.png`,
        });

        let result = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': process.env.EXPO_PUBLIC_REMOVEBG_API_KEY,
            },
            body: formdata,
        })
        result = await result.arrayBuffer();
        const processedImageBase64 = base64.fromByteArray(new Uint8Array(result));
        return processedImageBase64;
    }
}