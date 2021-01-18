(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.core = global.core || {}, global.core.umd = global.core.umd || {}, global.core.umd.js = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const create = () => __awaiter(void 0, void 0, void 0, function* () {
        const signingKey = yield crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-384" }, true, ["sign", "verify"]);
        const encryptionKey = yield window.crypto.subtle.generateKey({
            name: "ECDH",
            namedCurve: "P-384"
        }, true, ["deriveKey"]);
        const publicSigningKey = yield crypto.subtle.exportKey('jwk', signingKey.publicKey);
        const privateSigningKey = yield crypto.subtle.exportKey('jwk', signingKey.privateKey);
        const publicEncryptionKey = yield crypto.subtle.exportKey('jwk', encryptionKey.publicKey);
        const privateEncryptionKey = yield crypto.subtle.exportKey('jwk', encryptionKey.privateKey);
        return {
            signingSecret: privateSigningKey.d,
            signingKey: publicSigningKey,
            encryptionKey: publicEncryptionKey,
            encryptionSecret: privateEncryptionKey.d,
        };
    });
    const importSigningKey = (jwk, key) => {
        if (!jwk) {
            return;
        }
        delete key.key_ops;
        return crypto.subtle.importKey('jwk', Object.assign(Object.assign({}, key), { d: jwk }), {
            name: 'ECDSA',
            namedCurve: "P-384",
        }, true, ["sign"]);
    };
    const importEncryptionKey = (jwk, key) => {
        if (!jwk) {
            return;
        }
        delete key.key_ops;
        return crypto.subtle.importKey('jwk', Object.assign(Object.assign({}, key), { d: jwk }), {
            name: 'ECDH',
            namedCurve: "P-384",
        }, true, ["deriveKey", "deriveBits"]);
    };
    const verifySignature = (publicKey, signature, transaction) => crypto.subtle.verify({
        name: "ECDSA",
        hash: { name: "SHA-384" },
    }, publicKey, signature, transaction);
    const verifyEncryptionKey = (publicKey, signature, transaction) => crypto.subtle.verify({
        name: "ECDSA",
        hash: { name: "SHA-384" },
    }, publicKey, signature, transaction);

    // Encode JSON object to UTF-8 Buffer
    const encode = (data) => new TextEncoder().encode(JSON.stringify(data));
    const get_hash_buffer = (data) => crypto.subtle.digest('SHA-256', encode(data));
    const get_hash_array = (hash) => Array.from(new Uint8Array(hash));
    const get_hash_hex = (hash) => hash.map(buf => buf.toString(16)).join('');
    function hash_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash_buffer = yield get_hash_buffer(data);
            const hash_array = get_hash_array(hash_buffer);
            return get_hash_hex(hash_array);
        });
    }
    const signTransaction = (privateKey, transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const buffer = yield encode(transaction);
        const signatureBuffer = yield window.crypto.subtle.sign({
            name: "ECDSA",
            hash: {
                name: "SHA-384"
            },
        }, privateKey, buffer);
        var u8 = new Uint8Array(signatureBuffer);
        return btoa(String.fromCharCode.apply(null, u8));
    });

    function proof_of_work(block, difficulty) {
        return __awaiter(this, void 0, void 0, function* () {
            const find_hash = (block) => __awaiter(this, void 0, void 0, function* () {
                let hash = yield hash_data(block);
                if (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
                    const nonce = block.nonce + 1;
                    hash = yield find_hash(Object.assign(Object.assign({}, block), { nonce }));
                }
                return hash;
            });
            const hash = yield find_hash(Object.assign({ nonce: 0 }, block));
            return hash;
        });
    }
    function is_valid_proof(block, hash, difficulty) {
        return __awaiter(this, void 0, void 0, function* () {
            const block_hash = yield hash_data(block);
            return (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
                && hash === block_hash);
        });
    }
    function add_transaction(transaction, blockchain) {
        return Object.assign(Object.assign({}, blockchain), { pending_transactions: Array.from(new Set([...blockchain.pending_transactions, transaction])) });
    }
    function mine(blockchain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!blockchain.pending_transactions.length) {
                return blockchain;
            }
            const last_block = blockchain.chain[blockchain.chain.length - 1];
            const new_block = create_block(blockchain.pending_transactions, last_block.hash);
            const proof = yield proof_of_work(new_block, blockchain.difficulty);
            const mined = yield add_block(blockchain, new_block, proof);
            return Object.assign(Object.assign({}, mined), { pending_transactions: [] });
        });
    }
    function is_chain_valid(chain) {
        for (let i = 1; i < chain.length; i++) {
            const current_block = chain[i];
            const previous_block = chain[i - 1];
            if (current_block.previous_hash !== previous_block.hash) {
                return false;
            }
        }
        return true;
    }
    function add_block(blockchain, block, proof) {
        return __awaiter(this, void 0, void 0, function* () {
            const last_block = blockchain.chain[blockchain.chain.length - 1];
            if (last_block.hash !== block.previous_hash) {
                return blockchain;
            }
            if (!is_valid_proof(block, proof, blockchain.difficulty)) {
                return blockchain;
            }
            return Object.assign(Object.assign({}, blockchain), { chain: [
                    ...blockchain.chain,
                    Object.assign(Object.assign({}, block), { hash: proof }),
                ], pending_transactions: [...blockchain.pending_transactions] });
        });
    }
    function create_block(transactions = [], previous_hash = '0') {
        return {
            transactions,
            timestamp: Date.now(),
            previous_hash,
            hash: '0',
            nonce: 0,
        };
    }
    function create_blockchain(difficulty = 1, pending_transactions = [], chain = []) {
        return {
            difficulty,
            pending_transactions: [...pending_transactions],
            chain: [...chain],
            id: '',
        };
    }
    function create_genesis_block(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const timestamp = Date.now();
            const id = yield hash_data(`${JSON.stringify(data.creator_key)}_${timestamp}`);
            const signature = yield signTransaction(data.signingKey, { timestamp, id });
            const genesis_block = create_block([{
                    action: 'create',
                    type: 'document',
                    data: { timestamp, id },
                    signature,
                    user: data.creator_key,
                }]);
            const hash = yield hash_data(genesis_block);
            return Object.assign(Object.assign({}, genesis_block), { hash });
        });
    }
    function create$1(genesis_data, difficulty) {
        return __awaiter(this, void 0, void 0, function* () {
            const blockchain = create_blockchain(difficulty);
            const genesis_block = yield create_genesis_block(genesis_data);
            blockchain.id = genesis_block.hash;
            blockchain.chain.push(genesis_block);
            return blockchain;
        });
    }

    const BIND_IGNORED = [
        'String',
        'Number',
        'Object',
        'Array',
        'Boolean',
        'Date'
    ];

    function isObj(object) { return object && typeof object === 'object' }
    function setHiddenKey(object, key, value) {
        Object.defineProperty(object, key, { value, enumerable: false, configurable: true });
    }
    function defineBubblingProperties(object, key, parent) {
        setHiddenKey(object, '__key', key);
        setHiddenKey(object, '__parent', parent);
    }
    function getInstanceMethodKeys(object) {
        return (
            Object
                .getOwnPropertyNames(object)
                .concat(
                    Object.getPrototypeOf(object) &&
                    BIND_IGNORED.indexOf(Object.getPrototypeOf(object).constructor.name) < 0 ?
                        Object.getOwnPropertyNames(Object.getPrototypeOf(object)) :
                        []
                )
                .filter(prop => prop !== 'constructor' && typeof object[prop] === 'function')
        )
    }

    const data = {
        computedStack: [],
        observersMap: new WeakMap(),
        computedDependenciesTracker: new WeakMap()
    };

    let timeout = null;
    const queue = new Set();
    function process() {
        for(const task of queue) {
            task();
        }
        queue.clear();
        timeout = null;
    }

    function enqueue(task, batch) {
        if(timeout === null)
            timeout = setTimeout(process, batch === true ? 0 : batch);
        queue.add(task);
    }

    const { observersMap, computedStack, computedDependenciesTracker } = data;

    function observe(obj, options = {}) {
        // 'deep' is slower but reasonable; 'shallow' a performance enhancement but with side-effects
        const {
            props,
            ignore,
            batch,
            deep = true,
            bubble,
            bind
        } = options;

        // Ignore if the object is already observed
        if(obj.__observed) {
            return obj
        }

        // If the prop is explicitely not excluded
        const isWatched = prop => (!props || props.includes(prop)) && (!ignore || !ignore.includes(prop));

        // Add the object to the observers map.
        // observersMap signature : Map<Object, Map<Property, Set<Computed function>>>
        // In other words, observersMap is a map of observed objects.
        // For each observed object, each property is mapped with a set of computed functions depending on this property.
        // Whenever a property is set, we re-run each one of the functions stored inside the matching Set.
        observersMap.set(obj, new Map());

        // If the deep flag is set, observe nested objects/arrays
        if(deep) {
            Object.entries(obj).forEach(function([key, val]) {
                if(isObj(val)) {
                    obj[key] = observe(val, options);
                    // If bubble is set, we add keys to the object used to bubble up the mutation
                    if(bubble) {
                        defineBubblingProperties(obj[key], key, obj);
                    }
                }
            });
        }

        // Proxify the object in order to intercept get/set on props
        const proxy = new Proxy(obj, {
            get(_, prop) {
                if(prop === '__observed')
                    return true

                // If the prop is watched
                if(isWatched(prop)) {
                    // If a computed function is being run
                    if(computedStack.length) {
                        const propertiesMap = observersMap.get(obj);
                        if(!propertiesMap.has(prop))
                            propertiesMap.set(prop, new Set());
                        // Tracks object and properties accessed during the function call
                        const tracker = computedDependenciesTracker.get(computedStack[0]);
                        if(tracker) {
                            if(!tracker.has(obj)) {
                                tracker.set(obj, new Set());
                            }
                            tracker.get(obj).add(prop);
                        }
                        // Link the computed function and the property being accessed
                        propertiesMap.get(prop).add(computedStack[0]);
                    }
                }

                return obj[prop]
            },
            set(_, prop, value) {
                if(prop === '__handler') {
                    // Don't track bubble handlers
                    setHiddenKey(obj, '__handler', value);
                } else if(!isWatched(prop)) {
                    // If the prop is ignored
                    obj[prop] = value;
                } else if(Array.isArray(obj) && prop === 'length' || obj[prop] !== value) {
                    // If the new/old value are not equal
                    const deeper = deep && isObj(value);
                    const propertiesMap = observersMap.get(obj);

                    // Remove bubbling infrastructure and pass old value to handlers
                    const oldValue = obj[prop];
                    if(isObj(oldValue))
                        delete obj[prop];

                    // If the deep flag is set we observe the newly set value
                    obj[prop] = deeper ? observe(value, options) : value;

                    // Co-opt assigned object into bubbling if appropriate
                    if(deeper && bubble) {
                        defineBubblingProperties(obj[prop], prop, obj);
                    }

                    const ancestry = [ prop ];
                    let parent = obj;
                    while(parent) {
                        // If a handler explicitly returns 'false' then stop propagation
                        if(parent.__handler && parent.__handler(ancestry, value, oldValue, proxy) === false) {
                            break
                        }
                        // Continue propagation, traversing the mutated property's object hierarchy & call any __handlers along the way
                        if(parent.__key && parent.__parent) {
                            ancestry.unshift(parent.__key);
                            parent = parent.__parent;
                        } else {
                            parent = null;
                        }
                    }

                    const dependents = propertiesMap.get(prop);
                    if(dependents) {
                        // Retrieve the computed functions depending on the prop
                        for(const dependent of dependents) {
                            const tracker = computedDependenciesTracker.get(dependent);
                            // If the function has been disposed or if the prop has not been used
                            // during the latest function call, delete the function reference
                            if(dependent.__disposed || tracker && (!tracker.has(obj) || !tracker.get(obj).has(prop))) {
                                dependents.delete(dependent);
                            } else if(dependent !== computedStack[0]) {
                                // Run the computed function
                                if(batch) {
                                    enqueue(dependent, batch);
                                } else {
                                    dependent();
                                }
                            }
                        }
                    }
                }

                return true
            }
        });

        if(bind) {
            // Need this for binding es6 classes methods which are stored in the object prototype
            getInstanceMethodKeys(obj).forEach(key => obj[key] = obj[key].bind(proxy));
        }

        return proxy
    }

    const { computedStack: computedStack$1, computedDependenciesTracker: computedDependenciesTracker$1 } = data;

    function computed(wrappedFunction, { autoRun = true, callback, bind, disableTracking = false } = {}) {
        // Proxify the function in order to intercept the calls
        const proxy = new Proxy(wrappedFunction, {
            apply(target, thisArg, argsList) {
                function observeComputation(fun) {
                    // Track object and object properties accessed during this function call
                    if(!disableTracking) {
                        computedDependenciesTracker$1.set(callback || proxy, new WeakMap());
                    }
                    // Store into the stack a reference to the computed function
                    computedStack$1.unshift(callback || proxy);
                    // Run the computed function - or the async function
                    const result = fun ?
                        fun() :
                        target.apply(bind || thisArg, argsList);
                    // Remove the reference
                    computedStack$1.shift();
                    // Return the result
                    return result
                }

                // Inject the computeAsync argument which is used to manually declare when the computation takes part
                argsList.push({
                    computeAsync: function(target) { return observeComputation(target) }
                });

                return observeComputation()
            }
        });

        // If autoRun, then call the function at once
        if(autoRun) {
            proxy();
        }

        return proxy
    }

    // The disposed flag which is used to remove a computed function reference pointer
    function dispose(computedFunction) {
        data.computedDependenciesTracker.delete(computedFunction);
        return computedFunction.__disposed = true
    }

    var hyperactiv = {
        observe,
        computed,
        dispose
    };

    const instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);

    let idbProxyableTypes;
    let cursorAdvanceMethods;
    // This is a function to prevent it throwing up in node environments.
    function getIdbProxyableTypes() {
        return (idbProxyableTypes ||
            (idbProxyableTypes = [
                IDBDatabase,
                IDBObjectStore,
                IDBIndex,
                IDBCursor,
                IDBTransaction,
            ]));
    }
    // This is a function to prevent it throwing up in node environments.
    function getCursorAdvanceMethods() {
        return (cursorAdvanceMethods ||
            (cursorAdvanceMethods = [
                IDBCursor.prototype.advance,
                IDBCursor.prototype.continue,
                IDBCursor.prototype.continuePrimaryKey,
            ]));
    }
    const cursorRequestMap = new WeakMap();
    const transactionDoneMap = new WeakMap();
    const transactionStoreNamesMap = new WeakMap();
    const transformCache = new WeakMap();
    const reverseTransformCache = new WeakMap();
    function promisifyRequest(request) {
        const promise = new Promise((resolve, reject) => {
            const unlisten = () => {
                request.removeEventListener('success', success);
                request.removeEventListener('error', error);
            };
            const success = () => {
                resolve(wrap(request.result));
                unlisten();
            };
            const error = () => {
                reject(request.error);
                unlisten();
            };
            request.addEventListener('success', success);
            request.addEventListener('error', error);
        });
        promise
            .then((value) => {
            // Since cursoring reuses the IDBRequest (*sigh*), we cache it for later retrieval
            // (see wrapFunction).
            if (value instanceof IDBCursor) {
                cursorRequestMap.set(value, request);
            }
            // Catching to avoid "Uncaught Promise exceptions"
        })
            .catch(() => { });
        // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This
        // is because we create many promises from a single IDBRequest.
        reverseTransformCache.set(promise, request);
        return promise;
    }
    function cacheDonePromiseForTransaction(tx) {
        // Early bail if we've already created a done promise for this transaction.
        if (transactionDoneMap.has(tx))
            return;
        const done = new Promise((resolve, reject) => {
            const unlisten = () => {
                tx.removeEventListener('complete', complete);
                tx.removeEventListener('error', error);
                tx.removeEventListener('abort', error);
            };
            const complete = () => {
                resolve();
                unlisten();
            };
            const error = () => {
                reject(tx.error || new DOMException('AbortError', 'AbortError'));
                unlisten();
            };
            tx.addEventListener('complete', complete);
            tx.addEventListener('error', error);
            tx.addEventListener('abort', error);
        });
        // Cache it for later retrieval.
        transactionDoneMap.set(tx, done);
    }
    let idbProxyTraps = {
        get(target, prop, receiver) {
            if (target instanceof IDBTransaction) {
                // Special handling for transaction.done.
                if (prop === 'done')
                    return transactionDoneMap.get(target);
                // Polyfill for objectStoreNames because of Edge.
                if (prop === 'objectStoreNames') {
                    return target.objectStoreNames || transactionStoreNamesMap.get(target);
                }
                // Make tx.store return the only store in the transaction, or undefined if there are many.
                if (prop === 'store') {
                    return receiver.objectStoreNames[1]
                        ? undefined
                        : receiver.objectStore(receiver.objectStoreNames[0]);
                }
            }
            // Else transform whatever we get back.
            return wrap(target[prop]);
        },
        set(target, prop, value) {
            target[prop] = value;
            return true;
        },
        has(target, prop) {
            if (target instanceof IDBTransaction &&
                (prop === 'done' || prop === 'store')) {
                return true;
            }
            return prop in target;
        },
    };
    function replaceTraps(callback) {
        idbProxyTraps = callback(idbProxyTraps);
    }
    function wrapFunction(func) {
        // Due to expected object equality (which is enforced by the caching in `wrap`), we
        // only create one new func per func.
        // Edge doesn't support objectStoreNames (booo), so we polyfill it here.
        if (func === IDBDatabase.prototype.transaction &&
            !('objectStoreNames' in IDBTransaction.prototype)) {
            return function (storeNames, ...args) {
                const tx = func.call(unwrap(this), storeNames, ...args);
                transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
                return wrap(tx);
            };
        }
        // Cursor methods are special, as the behaviour is a little more different to standard IDB. In
        // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the
        // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense
        // with real promises, so each advance methods returns a new promise for the cursor object, or
        // undefined if the end of the cursor has been reached.
        if (getCursorAdvanceMethods().includes(func)) {
            return function (...args) {
                // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
                // the original object.
                func.apply(unwrap(this), args);
                return wrap(cursorRequestMap.get(this));
            };
        }
        return function (...args) {
            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use
            // the original object.
            return wrap(func.apply(unwrap(this), args));
        };
    }
    function transformCachableValue(value) {
        if (typeof value === 'function')
            return wrapFunction(value);
        // This doesn't return, it just creates a 'done' promise for the transaction,
        // which is later returned for transaction.done (see idbObjectHandler).
        if (value instanceof IDBTransaction)
            cacheDonePromiseForTransaction(value);
        if (instanceOfAny(value, getIdbProxyableTypes()))
            return new Proxy(value, idbProxyTraps);
        // Return the same value back if we're not going to transform it.
        return value;
    }
    function wrap(value) {
        // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because
        // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.
        if (value instanceof IDBRequest)
            return promisifyRequest(value);
        // If we've already transformed this value before, reuse the transformed value.
        // This is faster, but it also provides object equality.
        if (transformCache.has(value))
            return transformCache.get(value);
        const newValue = transformCachableValue(value);
        // Not all types are transformed.
        // These may be primitive types, so they can't be WeakMap keys.
        if (newValue !== value) {
            transformCache.set(value, newValue);
            reverseTransformCache.set(newValue, value);
        }
        return newValue;
    }
    const unwrap = (value) => reverseTransformCache.get(value);

    /**
     * Open a database.
     *
     * @param name Name of the database.
     * @param version Schema version.
     * @param callbacks Additional callbacks.
     */
    function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
        const request = indexedDB.open(name, version);
        const openPromise = wrap(request);
        if (upgrade) {
            request.addEventListener('upgradeneeded', (event) => {
                upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction));
            });
        }
        if (blocked)
            request.addEventListener('blocked', () => blocked());
        openPromise
            .then((db) => {
            if (terminated)
                db.addEventListener('close', () => terminated());
            if (blocking)
                db.addEventListener('versionchange', () => blocking());
        })
            .catch(() => { });
        return openPromise;
    }

    const readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];
    const writeMethods = ['put', 'add', 'delete', 'clear'];
    const cachedMethods = new Map();
    function getMethod(target, prop) {
        if (!(target instanceof IDBDatabase &&
            !(prop in target) &&
            typeof prop === 'string')) {
            return;
        }
        if (cachedMethods.get(prop))
            return cachedMethods.get(prop);
        const targetFuncName = prop.replace(/FromIndex$/, '');
        const useIndex = prop !== targetFuncName;
        const isWrite = writeMethods.includes(targetFuncName);
        if (
        // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
        !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||
            !(isWrite || readMethods.includes(targetFuncName))) {
            return;
        }
        const method = async function (storeName, ...args) {
            // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(
            const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');
            let target = tx.store;
            if (useIndex)
                target = target.index(args.shift());
            const returnVal = await target[targetFuncName](...args);
            if (isWrite)
                await tx.done;
            return returnVal;
        };
        cachedMethods.set(prop, method);
        return method;
    }
    replaceTraps((oldTraps) => ({
        ...oldTraps,
        get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
        has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),
    }));

    const createDb = (name, version, objectStores) => __awaiter(void 0, void 0, void 0, function* () {
        return openDB(name, version, {
            upgrade(db) {
                [{ name: 'key_store' }, ...objectStores]
                    .forEach(({ name, config }) => db.createObjectStore(name, config));
            },
            blocked() {
                console.log('blocked');
            },
            blocking() {
                console.log('blocking');
            },
            terminated() {
                console.log('terminated');
            },
        });
    });
    const createDbApi = (db) => ({
        create: (type, obj) => {
            try {
                return db.add(type, obj);
            }
            catch (e) {
                console.error('Create Error:', e);
            }
        },
        update: (type, obj, id) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (id) {
                    const obj1 = yield db.get(type, id);
                    return db.put(type, obj, id);
                }
                return db.put(type, obj);
            }
            catch (e) {
                console.error('Update Error:', e);
            }
        }),
        delete: (type, obj) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                return db.delete(type, obj.id);
            }
            catch (e) {
                console.error('Delete Error:', e);
            }
        }),
        get: (type, obj, id) => id ? db.get(type, id) : db.getAll(type, id),
    });

    const { observe: observe$1, computed: computed$1 } = hyperactiv;
    const getNewTransactions = (blockchain, transactionLog = []) => __awaiter(void 0, void 0, void 0, function* () {
        const { chain, pending_transactions } = blockchain;
        const transactions = [
            ...chain.reduce((acc, block) => ([...acc, ...block.transactions]), []),
            ...pending_transactions,
        ];
        const transactionPromises = transactions.map((transaction) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
                const hash = yield hash_data(transaction);
                const hasRan = transactionLog.includes(hash);
                resolve({ hasRan, transaction });
            }));
        }));
        const transactionsToRun = yield Promise.all(transactionPromises);
        return transactionsToRun.filter((run) => !run.hasRan);
    });
    const syncDb = (transactions = [], dbApi, transactionLog = []) => __awaiter(void 0, void 0, void 0, function* () {
        const newTransactions = [];
        const hashPromise = transactions.map(({ transaction }) => __awaiter(void 0, void 0, void 0, function* () {
            const { action, type, data } = transaction;
            const actionKey = action;
            yield dbApi[actionKey](type, data);
            const hash = yield hash_data(transaction);
            newTransactions.push(hash);
            return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () { return resolve(null); }));
        }));
        yield Promise.all(hashPromise);
        yield dbApi.update('key_store', [...transactionLog, ...newTransactions], 'transaction_log');
    });
    const createApi = () => ({
        create: (type, obj, blockchain, user, jwk) => __awaiter(void 0, void 0, void 0, function* () {
            const timestamp = Date.now();
            const id = yield hash_data(`${obj.id}_${timestamp}`);
            const data = Object.assign(Object.assign({}, obj), { id,
                timestamp });
            const signature = yield signTransaction(jwk, data);
            return add_transaction({ type, action: 'create', data, user, signature }, blockchain);
        }),
        update: (type, obj, blockchain, user, jwk) => __awaiter(void 0, void 0, void 0, function* () {
            const timestamp = Date.now();
            const data = Object.assign(Object.assign({}, obj), { timestamp });
            const signature = yield signTransaction(jwk, data);
            return add_transaction({ type, action: 'update', data, user, signature }, blockchain);
        }),
        delete: (type, obj, blockchain, user, jwk) => __awaiter(void 0, void 0, void 0, function* () {
            const timestamp = Date.now();
            const data = Object.assign(Object.assign({}, obj), { timestamp });
            const signature = yield signTransaction(jwk, data);
            return add_transaction({ type, action: 'delete', data, user, signature }, blockchain);
        }),
    });
    const start = (user, signingKey, blockchain, objectStores, watch) => __awaiter(void 0, void 0, void 0, function* () {
        const db = yield createDb(blockchain.id, 1, objectStores.map((name) => ({ name, config: { keyPath: 'id' } })));
        const dbApi = yield createDbApi(db);
        const api = yield createApi();
        const observed = observe$1({ blockchain });
        computed$1(() => __awaiter(void 0, void 0, void 0, function* () {
            const { blockchain } = observed;
            if (!blockchain) {
                return;
            }
            let cleanBlockchain = JSON.parse(JSON.stringify(blockchain));
            yield dbApi.update('key_store', cleanBlockchain, 'blockchain');
            const transactionLog = yield dbApi.get('key_store', {}, 'transaction_log');
            const transactions = yield getNewTransactions(cleanBlockchain, transactionLog || []);
            yield syncDb(transactions, dbApi, transactionLog || []);
            // set a dirty flag for external reactivity;
            watch(cleanBlockchain);
        }));
        return {
            create: (type, obj) => __awaiter(void 0, void 0, void 0, function* () {
                observed.blockchain = yield api.create(type, obj, observed.blockchain, user, signingKey);
            }),
            update: (type, obj) => __awaiter(void 0, void 0, void 0, function* () {
                observed.blockchain = yield api.update(type, obj, observed.blockchain, user, signingKey);
            }),
            delete: (type, obj) => __awaiter(void 0, void 0, void 0, function* () {
                observed.blockchain = yield api.delete(type, obj, observed.blockchain, user, signingKey);
            }),
            get: dbApi.get,
            transactionLog: () => __awaiter(void 0, void 0, void 0, function* () {
                const { chain, pending_transactions } = observed.blockchain;
                return [
                    ...chain.reduce((acc, curr) => ([
                        ...acc,
                        ...curr.transactions,
                    ]), []),
                    ...pending_transactions.map((trans) => (Object.assign(Object.assign({}, trans), { pending: true }))),
                ];
            }),
            commit: () => __awaiter(void 0, void 0, void 0, function* () {
                observed.blockchain = yield mine(observed.blockchain);
            }),
            pendingTransactions: () => observed.blockchain.pending_transactions,
            close: () => __awaiter(void 0, void 0, void 0, function* () {
                yield db.close();
                var req = indexedDB.deleteDatabase(observed.blockchain.id);
                req.onsuccess = function () {
                    console.log('DB dropped');
                };
                req.onerror = function () {
                    console.log("Couldn't delete database");
                };
                req.onblocked = function () {
                    console.log("Couldn't delete database due to the operation being blocked");
                };
            }),
        };
    });

    const auth = {
        create: create,
        importSigningKey,
        importEncryptionKey,
        verifySignature,
        verifyEncryptionKey,
    };
    const document = {
        create: create$1,
        load: start,
        commit: mine,
        verify: is_chain_valid
    };

    exports.auth = auth;
    exports.document = document;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
