export declare const encode: (data: Object) => ArrayBuffer;
export declare const decode: (data: ArrayBuffer) => Object;
export declare const get_hash_buffer: (data: Object) => PromiseLike<ArrayBuffer>;
export declare const get_hash_array: (hash: ArrayBuffer) => number[];
export declare const get_hash_hex: (hash: Array<number>) => string;
export declare function hash_data(data: Object): Promise<string>;
