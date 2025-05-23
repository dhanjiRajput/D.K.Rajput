import axios from "axios";
import { generate } from "random-words";
import _ from "lodash";

type LangType = string;

const generateMcq = (words: string[], idx: number): string[] => {
    const correct = words[idx];
    const others = words.filter((_, i) => i !== idx).slice(0, 3); // pick 2 other words
    const mcq = [correct, ...others].sort(() => Math.random() - 0.5); // shuffle
    return mcq;
};

export const translateWords = async (params: LangType): Promise<WordType[]> => {
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
                format: 'text',
            }
        };

        const response = await axios.request(options);

        const translations = response.data.data.translations; // array of { translatedText: string }

        const result: WordType[] = translations.map((t: { translatedText: string }, idx: number) => {
            const options = generateMcq(words, idx);
            return {
                word: t.translatedText,
                meaning: words[idx],
                options,
            };
        });

        return result;

    } catch (error) {
        console.error("Translation error:", error);
        throw new Error("Translation failed");
    }
};

export const countMatchingElements = (arr1: string[], arr2: string[]): number => {
    if (arr1.length != arr2.length) throw new Error("Arrays ar not Equal");
    let matchingCount = 0;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] === arr2[i]) {
            matchingCount++;
        }
    }
    return matchingCount;
};

export const fetchAudio =async (text: string, language: LangType): Promise<string> => {

    const encodedParams = new URLSearchParams({src:text,r:"0",c:"mp3",f:'8khz_8bit_mono',b64:"true"});
    if(language==='ja') encodedParams.set("hl","ja-jp");
    else if(language==='es') encodedParams.set("hl","es-es");
    else if(language==='fr') encodedParams.set("hl","fr-fr");
    else if(language==='hi') encodedParams.set("hl","hi-in");

    const {data}:{data:string}=await axios.post("https://voicerss-text-to-speech.p.rapidapi.com/",encodedParams,{
        params:{key:"e1fb3e5c3d364d2d98dd675560aee657"},
        headers: {
            'x-rapidapi-key': '7d7b94b2c4mshcee6284308525d2p191025jsne2a4ce9c4669',
            'x-rapidapi-host': 'voicerss-text-to-speech.p.rapidapi.com',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    });

    return data;
};
