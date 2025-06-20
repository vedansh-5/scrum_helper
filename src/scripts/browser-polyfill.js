const browserAPI = (() => {
    const api = typeof browser !== 'undefined' ? browser : chrome;

    return {
        storage: {
            local: {
                get: (keys) => {
                    return new Promise((resolve) => {
                        api.storage.local.get(keys, (result) => {
                            resolve(result);
                        });
                    });
                },
                set: (items) => {
                    return new Promise((resolve) => {
                        api.storage.local.set(items, () => {
                            resolve();
                        });
                    });
                },
                remove: (keys) => {
                    return new Promise((resolve) => {
                        api.storage.local.remove(keys, () => {
                            resolve();
                        });
                    });
                }
            }
        },
        rabs: {
            query: (queryInfo) => {
                return new Promise((resolve) => {
                    api.tabs.query(queryInfo, (tabs) => {
                        resolve(tabs);
                    });
                });
            },
            sendMessage: (tabId, message) => {
                return new Promise((resolve) => {
                    api.tabs.sendMessage(tabId, message, (response) => {
                        resolve(response);
                    });
                });
            }
        },
        runtime: {
            onMessage: api.runtime.onMessage,
            getManifest: api.runtime.getManifest,
            getURL: api.runtime.getURL
        }
    };
})();