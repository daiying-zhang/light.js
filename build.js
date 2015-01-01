/**
 * @fileOverview
 * @author daiying.zhang
 */
({
    baseUrl: "./src",
    paths: {
        //jquery: "some/other/jquery"
    },
    name: "light",
    out: "light.js",
    optimize: "none",
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