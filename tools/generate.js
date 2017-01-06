var fs = require('fs');
var path = require('path');
var got = require('got');
var through2 = require('through2');
var split = require('split');
var changeCase = require('change-case');

var errorListUrl = 'https://src.chromium.org/viewvc/chrome/trunk/src/net/base/net_error_list.h';

var types = {
	0: 'system',
	100: 'connection',
	200: 'certificate',
	300: 'http',
	400: 'cache',
	500: 'unknown',
	600: 'ftp',
	700: 'certificate-manager',
	800: 'dns'
};

var sinkStream = through2(function (chunk, enc, next) {
	next();
});

var segmentsStream = (function () {
	var netErrorReg = /^<td class="vc_file_line_text">NET_ERROR\(([A-Z_]+), ([0-9-]+)\)/;
	var stopReg = /^<td class="vc_file_line_text">$/;
	var messageReg = /^<td class="vc_file_line_text">\/\/ (.*)/;
	var textReg = /^<td class="vc_file_line_text">/;
	var stream = through2.obj(function (line, enc, callback) {
		function next () {
			stream.push(line);
			return callback();
		}

		function inc () {
			stream.currentSegment += 1;
		}

		function addToSegment (line) {
			var seg = stream.segments[stream.currentSegment] || '';
			if (seg !== '') {
				seg += '\n';
			}
			seg += line;
			stream.segments[stream.currentSegment] = seg;
		}

		function prevSegment () {
			var backtrack = 1, message = [], line;
			do {
				line = stream.segments[stream.currentSegment - backtrack];
				if(messageReg.test(line)){
					var matches = messageReg.exec(line);
					message.push(matches[1].trim());
				}
				backtrack += 1
			}
			while(!stopReg.test(line));
			var msg = message.reverse().join(' ');
			return msg;
		}

		if (/^\s*$/.test(line)) {
			inc();
			return next();
		}

		if (netErrorReg.test(line)) {
			inc();
			addToSegment(line)

			var matches = netErrorReg.exec(line);

			var errorCode = parseInt(matches[2], 10);
			var errorMessage = prevSegment();
			var errorName = changeCase.pascalCase(matches[1]);
			var errorType = types[Math.floor(Math.abs(errorCode) / 100) * 100];

			if (!(/Error$/.test(errorName))) {
				errorName += 'Error';
			}

			stream.errors.push({
				name: changeCase.pascalCase(errorName),
				code: errorCode,
				type: errorType,
				message: errorMessage
			});

		} else {
			line = line.replace(/^\/\/\s*/, '');
			if(textReg.test(line)){
				addToSegment(line);
			}
		}
		return next();
	});

	stream.errors = [];
	stream.currentSegment = 0;
	stream.segments = [];

	return stream;
})();

var lineCount = 0;

got(errorListUrl)
	.pipe(split())
	.pipe(segmentsStream)
	.pipe(sinkStream)
	.on('finish', function () {
		fs.writeFile(
			path.resolve('./errors.json'),
			JSON.stringify(segmentsStream.errors, null, '  '),
			{ encoding: 'utf-8' },
			function (err) {
				if (err) { throw err; }
				console.log('done -', segmentsStream.errors.length, 'errors parsed');
			}
		);
	});
