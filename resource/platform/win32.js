'use strict';
/**
 * External Dependencies
 */
var path = require( 'path' );
var exec = require( 'child_process' ).execSync;
var spellchecker = require( '../lib/spellchecker' )

function cleanBuild( appPath, buildOpts ) {
	var appPath = appPath + '-' + buildOpts.arch;
	var files = [
		'resources/default_app/package.json',
		'resources/default_app/main.js'
	];

	console.log( 'Cleaning the Windows build' );

	for ( var i in files ) {
		var file = path.join( appPath, files[i] );
		exec( "/usr/bin/sed -i '' 's/Electron/" + buildOpts.name + "/' '" + file + "'" );
	}
}

module.exports = {
	cleaner: cleanBuild,
	beforeBuild: spellchecker.bind( null, 'http://automattic.github.io/wp-desktop/deps/spellchecker-win32-v3.0.2-electron-v0.36.0.zip' )
}
