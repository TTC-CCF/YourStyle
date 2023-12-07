import fs from "fs";

const ENDPOINT = "http://localhost:3000/api/v1/post";

const post_1 = {
    title: "夏日穿搭",
    description: "今天的陽光很適合穿吊帶褲!",
    user_id: "user_2Yy0g0uk8Ghu9fz9oJPOqhYxLN5",
    tags: ["GU", "夏天", "圖T"],
    image: "post_1.jpg",
};

const post_2 = {
    title: "秋冬穿搭",
    description: "Uniqlo燈心絨襯衫\nUnited Athle帽踢\nGU 格子褲\n Converse 1970s",
    user_id: "user_2Yy0g0uk8Ghu9fz9oJPOqhYxLN5",
    tags: ["Uniqlo", "GU", "秋冬", "素色", "格子褲", "Converse"],
    image: "post_2.jpg",
};

const post_3 = {
    title: "日系穿搭",
    description: "Jks 毛衣外套\nJks素踢\nGU 黑色長褲\n 無印 板鞋",
    user_id: "user_2Yy0g0uk8Ghu9fz9oJPOqhYxLN5",
    tags: ["Jks", "GU", "無印", "日系"],
    image: "post_3.jpg",
};

const post_4 = {
    title: "日系工裝",
    description: "Uniqlo襯衫\n格子襯衫\nJKS 軍綠寬褲\n Timberland",
    user_id: "user_2Yy0g0uk8Ghu9fz9oJPOqhYxLN5",
    tags: ["Uniqlo", "日系", "工裝", "JKS"],
    image: "post_4.jpg",
};

const post_5 = {
    title: "微正式穿搭",
    description: "西裝外套\n學院風背心\n工裝褲",
    user_id: "user_2Yy0g0uk8Ghu9fz9oJPOqhYxLN5",
    tags: ["夏天", "微正式"],
    image: "post_5.jpg",
};

const post_6 = {
    title: "Casual",
    description: "意外的跟我我的房間很搭\n萊姆綠大學踢\n七分牛仔",
    user_id: "user_2YyCYnYBfA9uJ39F5YekYLEsmqP",
    tags: ["日常", "大學踢"],
    image: "post_6.jpg",
};

const post_7 = {
    title: "街頭穿搭",
    description: "皮衣\n工裝褲\n水桶包",
    user_id: "user_2YyCYnYBfA9uJ39F5YekYLEsmqP",
    tags: ["街頭", "皮衣", "工裝褲"],
    image: "post_7.jpg",
};

const post_8 = {
    title: "多巴胺穿搭",
    description: "整身牛仔的多巴胺\nLevis",
    user_id: "user_2YyCYnYBfA9uJ39F5YekYLEsmqP",
    tags: ["多巴胺", "Levis"],
    image: "post_8.jpg",
};

const post_9 = {
    title: "街頭系列",
    description: "Casual的大學踢\nHokaOneOne\n小包",
    user_id: "user_2YyCYnYBfA9uJ39F5YekYLEsmqP",
    tags: ["街頭", "大學踢"],
    image: "post_9.jpg",
};

const post_10 = {
    title: "上課穿搭",
    description: "條紋上衣\n馬丁鞋\n藍白托特",
    user_id: "user_2Yy2ZMmQUugNoxKETW5pse0TMgP",
    tags: ["上課", "條紋"],
    image: "post_10.jpg",
};

async function createFormdata(post) {
    let formdata = new FormData();
    formdata.append("title", post.title);
    formdata.append("description", post.description);
    formdata.append("user_id", post.user_id);

    const image_file = await fs.openAsBlob(`images/${post.image}`, {type: 'image/jpeg'});
    formdata.append("image", image_file, post.image);

    for (const tag of post.tags) {
        formdata.append("tags[]", tag);
    }

    return formdata;
}

async function createPost(formdata) {
    
    try {
        let response = await fetch(
            `${ENDPOINT}/create`,
            {
                method: "POST",
                body: formdata,
            }
        );
        let json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error);
    }
}

function getRandomPost() {
    const posts = [post_1, post_2, post_3, post_4, post_5, post_6, post_7, post_8, post_9, post_10];
    const randomIndex = Math.floor(Math.random() * posts.length);
    return posts[randomIndex];
}

async function createMultiplePosts(post_cnt) {
    for (let i = 0; i < post_cnt; i++) {
        const post = getRandomPost();
        const formdata = await createFormdata(post);
        await createPost(formdata);
    }
}

await createMultiplePosts(30);
