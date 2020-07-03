const bindHook = function(action, func) {
    if (typeof func === 'function') {
        this.hooks[action] = func;
    }
};

module.exports = bindHook;