import { __awaiter } from "tslib";
// Encode JSON object to UTF-8 Buffer
export const encode = (data) => new TextEncoder().encode(JSON.stringify(data));
export const decode = (data) => new TextDecoder('utf-8').decode(new Uint8Array(data));
export const get_hash_buffer = (data) => crypto.subtle.digest('SHA-256', encode(data));
export const get_hash_array = (hash) => Array.from(new Uint8Array(hash));
export const get_hash_hex = (hash) => hash.map(buf => buf.toString(16)).join('');
export function hash_data(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash_buffer = yield get_hash_buffer(data);
        const hash_array = get_hash_array(hash_buffer);
        return get_hash_hex(hash_array);
    });
}
