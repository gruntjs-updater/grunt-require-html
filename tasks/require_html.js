/*
 * grunt-require-html
 * https://github.com/yanhaibiao/grunt-require-html
 *
 * Copyright (c) 2015 alexayan
 * Licensed under the MIT license.
 */

'use strict';

var process = require('process');

module.exports = function(grunt) {

  function transformLine(html){
    return "'" + html.replace(/'/g, "\\'") + "'+\n";
  }

  function makeRequire(config){
    var tpl = 'define("{{name}}", function(){var tpl = {{tpl}};return tpl;});';
    tpl = tpl.replace(/{{(\w+)}}/g, function(_, key){
      return config[key];
    });
    return tpl;
  }

  grunt.registerMultiTask('require_html', 'transform html to js require module', function() {
    var options = this.options({
      ignoreSpace: false,
      paths : {}
    });
    this.files.forEach(function(f) {
      var src = f.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var res='', line,
            lines = grunt.file.read(filepath).split('\n');
        lines.forEach(function(line){
          res += transformLine(line);
        });
        res = res.slice(0, res.length-2);
        res = makeRequire({
          tpl : res,
          name : options.paths[filepath] || filepath
        });
        return res;
      }).join('\n');

      grunt.file.write(f.dest, src);

      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
