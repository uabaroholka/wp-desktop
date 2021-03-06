/**
 * External Dependencies
 */
var packager = require( 'electron-packager' );
var fs = require( 'fs' );
var path = require( 'path' );

/**
 * Internal dependencies
 */
var builder = require( './resource/lib/tools' );
var config = require( './resource/lib/config' );
var pkg = require( './package.json' );

/**
 * Module variables
 */
var electronVersion = pkg.devDependencies['electron-prebuilt'].replace( '^', '' );
var key;

var opts = {
	dir: './',
	name: config.name,
	author: config.author,
	platform: builder.getPlatform( process.argv ),
	arch: builder.getArch( process.argv ),
	version: electronVersion,
	appVersion: config.version,
	appSign: 'Developer ID Application: ' + config.author,
	out: './release',
	icon: builder.getIconFile( process.argv ),
	'app-bundle-id': config.bundleId,
	'helper-bundle-id': config.bundleId,
	'app-version': config.version,
	'build-version': config.version,
	ignore: require( './resource/build-config/calypso-ignore' ),
	overwrite: true,
	asar: true,
	sign: false,
	'version-string': {
		CompanyName: config.author,
		LegalCopyright: config.copyright,
		ProductName: config.name,
		InternalName: config.name,
		FileDescription: config.name,
		OriginalFilename: config.name,
		FileVersion: config.version,
		ProductVersion: config.version
	}
};

function whitelistInDirectory( directory, whitelist ) {
	var client = fs.readdirSync( directory );
	var ignore = [];

	for ( key = 0; key < client.length; key++ ) {
		if ( whitelist.indexOf( client[key] ) === -1 ) {
			ignore.push( path.join( directory, client[key] ) );
		}
	}

	return ignore;
}

// Ignore all dev dependencies
for ( key in pkg.devDependencies ) {
	opts.ignore.push( 'node_modules/' + key );
}

for ( key in pkg.optionalDependencies ) {
	opts.ignore.push( 'node_modules/' + key );
}

opts.ignore = opts.ignore.concat( whitelistInDirectory( './calypso/client', [ 'sections.js', 'config' ] ) );
opts.ignore = opts.ignore.concat( whitelistInDirectory( './', [ 'calypso', 'desktop', 'public_desktop', 'node_modules', 'package.json' ] ) );

builder.beforeBuild( __dirname, opts, function( error ) {
	if ( error ) throw error;
	packager( opts, function( error ) {
		if ( error ) {
			console.log( error );
		} else {
			builder.cleanUp( path.join( __dirname, 'release' ), opts );
		}
	} );
} )
