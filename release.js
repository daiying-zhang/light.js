/**
 * @fileOverview
 * @author daiying.zhang
 */
({
    baseUrl: "./src",
    paths: {
    },
    name: "light",
    out: "light.min.js",
    optimize: "uglify",
    //optimize: "uglify2",
    //optimize: "closure",
    onModuleBundleComplete: function (data) {
        var fs = module.require('fs'),
            amdclean = module.require('amdclean'),
            outputFile = data.path,
            cleanedCode = amdclean.clean({
                'filePath': outputFile
            });

        fs.writeFileSync(outputFile, cleanedCode);
    }
})