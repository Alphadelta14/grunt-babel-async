'use strict';
var path = require('path');
var child_process = require('child_process');
var extend = require('util')._extend;

module.exports = function (grunt) {
	grunt.registerMultiTask('babel', 'Transpile ES6 to ES5', function () {
		var options = this.options();
		var async = this.async();

		var fileQueue = this.files;

		var workerCount = 8;

		for (var i = 0; i < workerCount; i++) {
			var child = child_process.fork(path.join(__dirname, '../babel-worker'));
			child.on('message', function (message) {
				if (message != 'ok') {
					return;
				}
				var next = fileQueue.shift();
				if (next) {
					child.send(extend({el: {src: next.src[0], dest: next.dest}}, options));
				} else {
					workerCount--;
					if (!workerCount) {
						async();
					}
					child.send(null);
				}
			});
		}
	});
};
// kate: tab-indents on; space-indent off; indent-width 4;
