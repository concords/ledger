// Encode JSON object to UTF-8 Buffer
export const encode = (data: Object): ArrayBuffer =>
    new TextEncoder().encode(JSON.stringify(data));

export const decode = (data: ArrayBuffer): Object =>
    new TextDecoder('utf-8').decode(new Uint8Array(data));


export const getHashBuffer = (data: Object): PromiseLike<ArrayBuffer> =>
    crypto.subtle.digest('SHA-256', encode(data));


export const getHashArray = (hash: ArrayBuffer) =>
    Array.from(new Uint8Array(hash));


export const getHashHex = (hash: Array<number>) =>
    hash.map(buf => buf.toString(16)).join('');


export async function hashData(data: Object): Promise<string> {
    const hash_buffer = await getHashBuffer(data);
    const hash_array = getHashArray(hash_buffer);
    return getHashHex(hash_array);
}



