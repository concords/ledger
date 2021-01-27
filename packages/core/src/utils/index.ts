// Encode JSON object to UTF-8 Buffer
export const encode = (data: Object): ArrayBuffer =>
    new TextEncoder().encode(JSON.stringify(data));

export const decode = (data: ArrayBuffer): Object =>
    new TextDecoder('utf-8').decode(new Uint8Array(data));


export const get_hash_buffer = (data: Object): PromiseLike<ArrayBuffer> =>
    crypto.subtle.digest('SHA-256', encode(data));


export const get_hash_array = (hash: ArrayBuffer) =>
    Array.from(new Uint8Array(hash));


export const get_hash_hex = (hash: Array<number>) =>
    hash.map(buf => buf.toString(16)).join('');


export async function hash_data(data: Object): Promise<string> {
    const hash_buffer = await get_hash_buffer(data);
    const hash_array = get_hash_array(hash_buffer);
    return get_hash_hex(hash_array);
}



