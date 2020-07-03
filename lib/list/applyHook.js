const applyHook = async function(action, ...arg) {
    const func = this.hooks[action];
    if (func) {
        /*
        ** return [error, data]
        */
        const result = await func(...arg);
        if (result instanceof Error) {
            return [result, undefined];
        }
        return [undefined, result];
    }
};

module.exports = applyHook;