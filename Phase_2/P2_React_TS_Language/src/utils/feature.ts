import axios from "axios"
import { generate } from "random-words"

type LangType = string;

export const translateWords = async (params: LangType) => {
    try {

        const words = generate(8) as string[];

        const options = {
            method: 'POST',
            url: 'https://google-translator9.p.rapidapi.com/v2',
            headers: {
                'x-rapidapi-key': '7d7b94b2c4mshcee6284308525d2p191025jsne2a4ce9c4669',
                'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
                'Content-Type': 'application/json'
            },
            data: {
                q: words,
                source: 'en',
                target: params,
                format: 'text'
            }
        };

        try {
            const {data} = await axios.request(options);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.log(error);
        throw new Error("Some Error....")
    }
};