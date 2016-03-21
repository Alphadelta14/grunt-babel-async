
var babel = require('babel-core');
var fs = require('fs');
var path = require('path');

process.on('message', function (options) {
	if (!options) {
		return;
	}
	var el = options.el;
	delete options.el;
	delete options.filename;
	delete options.filenameRelative;
	var start = new Date();

	options.sourceFileName = path.relative(path.dirname(el.dest), el.src);

	if (process.platform === 'win32') {
		options.sourceFileName = options.sourceFileName.replace(/\\/g, '/');
	}

	options.sourceMapTarget = path.basename(el.dest);

	var res = babel.transformFileSync(el.src, options);
	var sourceMappingURL = '';

	if (res.map) {
		sourceMappingURL = '\n//# sourceMappingURL=' + path.basename(el.dest) + '.map';
	}

	fs.writeFileSync(el.dest, res.code + sourceMappingURL + '\n');

	if (res.map) {
		fs.writeFileSync(el.dest + '.map', JSON.stringify(res.map));
	}
	console.log(new Date()-start, el.src);
	process.send('ok');
});

process.send('ok');

// kate: tab-indents on; space-indent off; indent-width 4;