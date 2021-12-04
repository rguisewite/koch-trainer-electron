const random	= require( 'random' );
const { app }	= require( 'electron' );
const path		= require( 'path' );
const fs		= require( 'fs' );

window.get_random = function( start, end )
{
	return random.int( start, end );
}

window.get_callsigns = function()
{
	return fs.readFileSync( path.resolve( __dirname, '../word-files/callsigns.txt' ), { encoding: 'utf8', flag: 'r' } ).split( '\n' );
}

window.get_words = function()
{
	return fs.readFileSync( path.resolve( __dirname, '../word-files/words.txt' ), { encoding: 'utf8', flag: 'r' } ).split( '\n' );
}