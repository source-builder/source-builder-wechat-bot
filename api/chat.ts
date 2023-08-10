import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const { SERVER_API: api, SERVER_SECRET: secret } = process.env;

export default async (request: VercelRequest, response: VercelResponse) => {
    const userId = request.query?.userId || '';
    const content = request.query?.content || '';
    if (!userId) return response.status(400).send('the value of param [userId] is empty').end();
    if (!content) return response.status(400).send('the value of param [content] is empty').end();
    response.status(200).send({ data: await chat(`${userId}`, `${content}`) })
}

async function sign(userid: string) {
    const { data } = await axios.post(`${api}/openapi/sign/${secret}`, {
        userid
    })
    return data['signature']
}

async function chat(userId: string, query: string) {
    const { data } = await axios.post(`${api}/openapi/aibot/${secret}`, {
        signature: await sign(userId),
        query,
    })
    return data['msg'][0]['content']
}