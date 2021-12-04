const electron							= require( 'electron' );
const { app, BrowserWindow, ipcMain }	= electron;
const { Menu, MenuItem }				= electron;

const electron_store					= require( 'electron-store' );
const default_opts						= require( './defaults.json' );
const store								= new electron_store();

const path								= require( 'path' );
const fs								= require( 'fs' );

global.about_window						= null;
global.main_window						= null;

require( '@electron/remote/main' ).initialize();

// Run
////////////////////////////////////////////////////

function Run()
{
	Main_CreateWindow();
	Main_OpenWindow();
}

app.on( 'ready', Run );

// Main Window
////////////////////////////////////////////////////

function Main_CreateWindow()
{
	var opts = new Object();

	Object.assign( opts, default_opts.main_window_options );
	Object.assign( opts, store.get( 'main_window_options' ) );
	Object.assign( opts.webPreferences, { preload: path.join( app.getAppPath(), 'assets/scripts/preload.js' ) } );

	global.main_window = new BrowserWindow( opts );
	global.main_window.loadFile( 'assets/templates/main.html' );

	global.main_window.once( 'ready-to-show', function()
	{
		global.main_window.ready_to_show = true;

		if ( global.main_window.show_when_ready )
		{
			delete global.main_window.show_when_ready;
			global.main_window.show();
		}
	} );

	global.main_window.on( 'show', function( event )
	{
		global.main_window.focus();
	} );

	global.main_window.on( 'hide', function( event )
	{
		store.set( 'main_window_options', global.main_window.getBounds() );
	} );

	global.main_window.on( 'close', function( event )
	{
		store.set( 'main_window_options', global.main_window.getBounds() );
	} );

	global.main_window.on( 'focus', function( event )
	{
		Main_SetMenu();
	} );
}

function Main_OpenWindow()
{
	if ( global.main_window.isVisible() )
	{
		global.main_window.focus();
		return;
	}

	if ( !global.main_window.ready_to_show )
	{
		global.main_window.show_when_ready = true;
		return;
	}

	if ( global.main_window.ipc_key )
	{
		global.main_window.send( 'mainprocess-response',
		{
			key:			global.main_window.ipc_key,
			command:		'request-reopen-main-window',
			data:			global.cached_api_connections,
			callback_data:	null
		} );
	}

	global.main_window.show();
}

function Main_SetMenu()
{
	var name, menu, template;

	template =
	[
		{
			label: 'Edit',
			submenu:
			[
				{
					role: 'undo'
				},
				{
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					role: 'cut'
				},
				{
					role: 'copy'
				},
				{
					role: 'paste'
				},
				{
					role: 'pasteandmatchstyle'
				},
				{
					role: 'selectall'
				}
			]
		},
		{
			role: 'window',
			submenu:
			[
				{
					role: 'minimize'
				},
				{
					role: 'close'
				}
			]
		}
	];

	if ( process.platform === 'darwin' )
	{
		name = app.getName();

		template.unshift(
		{
			label: name,
			submenu:
			[
				{
					label: 'About ' + name,
					click ( item, focusedWindow )
					{
						About_OpenWindow();
					}
				},
				{
					type: 'separator'
				},
				{
					role: 'services',
					submenu: []
				},
				{
					type: 'separator'
				},
				{
					role: 'hide'
				},
				{
					role: 'hideothers'
				},
				{
					role: 'unhide'
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click ( item, focusedWindow )
					{
						Quit();
					}
				}
			]
		} );

		//
		// Window menu
		//

		template[ 2 ].submenu =
		[
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			}
		];
	}

	if ( parseInt( process.env.ELECTRON_DEVELOPMENT_MODE, 10 ) === 1 )
	{
		template.splice( 2, 0,
		{
			label: 'View',
			submenu:
			[
				{
					role: 'reload'
				},
				{
					role: 'toggledevtools'
				}
			]
		} );
	}

	menu = Menu.buildFromTemplate( template );
	Menu.setApplicationMenu( menu );
}

// About Window
////////////////////////////////////////////////////

function About_OpenWindow()
{
	var opts;

	if ( global.about_window !== null )
	{
		global.about_window.focus();
		return;
	}

	opts = new Object();

	Object.assign( opts, default_opts.about_window_options );

	global.about_window = new BrowserWindow( opts );
	require( '@electron/remote/main' ).enable( global.about_window.webContents );
	global.about_window.loadFile( 'assets/templates/about.html' );

	global.about_window.once( 'ready-to-show', function()
	{
		global.about_window.show();
	} );

	global.about_window.on( 'show', function( event )
	{
		global.about_window.focus();
	} );

	global.about_window.on( 'focus', function( event )
	{
		About_SetMenu();
	} );

	global.about_window.on( 'close', function( event )
	{
		global.about_window = null;
	} );
}

function About_SetMenu()
{
	var name, menu, template;

	template =
	[
		{
			label: 'Edit',
			submenu:
			[
				{
					role: 'undo'
				},
				{
					role: 'redo'
				},
				{
					type: 'separator'
				},
				{
					role: 'cut'
				},
				{
					role: 'copy'
				},
				{
					role: 'paste'
				},
				{
					role: 'pasteandmatchstyle'
				},
				{
					role: 'selectall'
				}
			]
		},
		{
			role: 'window',
			submenu:
			[
				{
					role: 'minimize'
				},
				{
					role: 'close'
				}
			]
		}
	];

	if ( process.platform === 'darwin' )
	{
		name = app.getName();

		template.unshift(
		{
			label: name,
			submenu:
			[
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click ( item, focusedWindow )
					{
						Quit();
					}
				}
			]
		} );

		//
		// Window menu
		//

		template[ 2 ].submenu =
		[
			{
				label: 'Close',
				accelerator: 'CmdOrCtrl+W',
				role: 'close'
			},
			{
				label: 'Minimize',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize'
			}
		];
	}

	menu = Menu.buildFromTemplate( template );
	Menu.setApplicationMenu( menu );
}

// Notifications
////////////////////////////////////////////////////

function SendNotification_Cached( error )
{
	var error_message = ( error.hasOwnProperty( 'message' ) && typeof error.message === 'string' ? error.message : error );

	if ( global.last_error_message === error_message )
	{
		return;
	}

	if ( global.last_error_timeout )
	{
		clearTimeout( global.last_error_timeout );
	}

	//
	// Clear error after an hour
	//

	global.last_error_message = error_message;
	global.last_error_timeout = setTimeout( function()
	{
		global.last_error_message = null;
		global.last_error_timeout = null;
	}, 36000000 );

	SendNotification( 'Error', error_message );
}

function SendNotification( title, message )
{
	//
	// Notifications are sent via the HTML5 Notification API and must be created
	// from the renderer process. The main window is always "available", though
	// dynamically shown and hidden, so we will use it as the controller to
	// display notifications.
	//
	// Note that macOS limits notification body to 256 bytes. Windows 8 limits
	// to 250 characters. Windows 10 does not limit, but notes that lengths
	// "should be reasonable". We should limit the message to the lesser of
	// all (250 characters).
	//

	global.main_window.send( 'mainprocess-response',
	{
		notification:	true,
		title:			title,
		body:			typeof message === 'string' ? message.substr( 0, 250 ) : 'Unknown error message'
	} );
}

// Termination
////////////////////////////////////////////////////

function Quit()
{
	if ( global.tray_interval )
	{
		clearInterval( global.tray_interval );
	}

	app.quit();
}

// ipc Callback Functions
////////////////////////////////////////////////////

ipcMain.on( 'request-mainprocess-main', function( event, data )
{
	if ( data.command === 'update-window-key' )											global.main_window.ipc_key = data.key;
	else if ( data.command === 'request-main-window-close' )							return Request_MainWindow_Close( event, data );
} );

function Request_MainWindow_Close( event, data )
{
	global.main_window.hide();
}
