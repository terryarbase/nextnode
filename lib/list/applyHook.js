/*
** return [error, data]
*/

const applyHook = async function(action, ...arg) {
    const func = this.hooks[action];
    if (func) {
        const result = await func(...arg);
        if (result instanceof Error) {
            return [result, undefined];
        }
        return [undefined, result];
    } else {
        return [undefined, undefined];
    }
};

module.exports = applyHook;