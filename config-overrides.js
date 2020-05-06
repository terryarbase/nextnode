const path = require('path');

module.exports = {
    paths: function (paths, env) {        
        paths.appSrc = path.resolve(__dirname, 'src');
        console.log(paths.appSrc);
        return paths;
    },
}