class WebKochTrainer extends HTMLElement
{
	constructor()
	{
		super();
		const self = this;

		this._context						= new AudioContext();
		this._oscillator					= this._context.createOscillator();
		this._oscillator.type				= "sine";
		this._gain							= this._context.createGain();
		this._gain.gain.value				= 0;

		this._oscillator.connect( this._gain );
		this._gain.connect( this._context.destination );
		this._oscillator.start( 0 );

		this.initialize_letters();

		//
		// Build UI
		//

		this.initialize_ui();
	}

	connectedCallback()
	{
		this.defaults();
	}

	disconnectedCallback()
	{
		;
	}

	initialize_letters()
	{
		this._character_sequence = [ "K", "M", "R", "S", "U", "A", "P", "T", "L", "O",
									 "W", "I", ".", "N", "J", "E", "F", "0", "Y", ",",
									 "V", "G", "5", "/", "Q", "9", "Z", "H", "3", "8",
									 "B", "?", "4", "2", "7", "C", "1", "D", "6", "X",
									 "BT", "SK", "AR", "AA", "AS", "VE", "IN", "HH",
									 "KA", "CT", "KN", "NJ", "SN" ];

		this._letters = {
			'A':	'.-',
			'B':	'-...',
			'C':	'-.-.',
			'D':	'-..',
			'E':	'.',
			'F':	'..-.',
			'G':	'--.',
			'H':	'....',
			'I':	'..',
			'J':	'.---',
			'K':	'-.-',
			'L':	'.-..',
			'M':	'--',
			'N':	'-.',
			'O':	'---',
			'P':	'.--.',
			'Q':	'--.-',
			'R':	'.-.',
			'S':	'...',
			'T':	'-',
			'U':	'..-',
			'V':	'...-',
			'W':	'.--',
			'X':	'-..-',
			'Y':	'-.--',
			'Z':	'--..',
			'1':	'.----',
			'2':	'..---',
			'3':	'...--',
			'4':	'....-',
			'5':	'.....',
			'6':	'-....',
			'7':	'--...',
			'8':	'---..',
			'9':	'----.',
			'0':	'-----',
			'/':	'-..-.',
			'.':	'.-.-.-',
			',':	'--..--',
			'?':	'..--..',
			'AA':	'.-.-',
			'AR':	'.-.-.',
			'AS':	'.-...',
			'VE':	'...-.',
			'INT':	'..-.-',
			'HH':	'........',
			'BT':	'-...-',
			'KA':	'-.-.-',
			'CT':	'-.-.-',
			'KN':	'-.--.',
			'NJ':	'-..---',
			'SK':	'...-.-',
			'SN':	'...-.'
		};
	}

	initialize_ui()
	{
		this.element_container = this.newElement( 'span', { 'class': 'web-koch-trainer-container' }, this );

		this.initialize_ui_header();
		this.initialize_ui_content();
		this.initialize_ui_actionbar();
	}

	initialize_ui_header()
	{
		const self = this;

		this.element_header									= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header' },							this.element_container );

		this.element_header_title							= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-title' },					this.element_header );
		this.element_header_img								= this.newElement( 'img',	{ 'src': '../icons/png/logo_small.png' },						this.element_header_title );
		this.element_header_tabs							= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tabs' },					this.element_header );
		this.element_header_tab_random						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tab' },						this.element_header_tabs );
		this.element_header_tab_file						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tab' },						this.element_header_tabs );
		this.element_header_tab_callsign					= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tab' },						this.element_header_tabs );
		this.element_header_tab_word						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tab' },						this.element_header_tabs );

		this.element_header_tab_random.textContent			= 'Random';
		this.element_header_tab_file.textContent			= 'File';
		this.element_header_tab_callsign.textContent		= 'Call Sign';
		this.element_header_tab_word.textContent			= 'Word';

		this.element_header_tab_random.addEventListener(	'click', function( event ) { self.set_mode( 'random' ); },		false );
		this.element_header_tab_file.addEventListener(		'click', function( event ) { self.set_mode( 'file' ); },		false );
		this.element_header_tab_callsign.addEventListener(	'click', function( event ) { self.set_mode( 'callsign' ); },	false );
		this.element_header_tab_word.addEventListener(		'click', function( event ) { self.set_mode( 'word' ); },		false );
	}

	initialize_ui_content()
	{
		this.element_content = this.newElement( 'span', { 'class': 'web-koch-trainer-content' }, this.element_container );

		this.initialize_ui_content_random();
		this.initialize_ui_content_file();
		this.initialize_ui_content_callsign();
		this.initialize_ui_content_word();
	}

	initialize_ui_content_random()
	{
		const self = this;
		let i, i_len;

		this.element_content_random								= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random' },									this.element_content );
		this.element_content_random_source						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line' },							this.element_content_random );
		this.element_content_random_source_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line-prompt' },						this.element_content_random_source );
		this.element_content_random_source_value				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line-value' },						this.element_content_random_source );
		this.element_content_random_level						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line' },							this.element_content_random_source_value );
		this.element_content_random_level_radio					= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-random-line-radio', 'type': 'radio' },		this.element_content_random_level );
		this.element_content_random_level_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line-prompt' },						this.element_content_random_level );
		this.element_content_random_level_select				= this.newElement( 'select',{ 'class': 'web-koch-trainer-content-random-line-select' },						this.element_content_random_level );
		this.element_content_random_custom_characters			= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line' },							this.element_content_random_source_value );
		this.element_content_random_custom_characters_radio		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-random-line-prompt', 'type': 'radio' },	this.element_content_random_custom_characters );
		this.element_content_random_custom_characters_prompt	= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line-prompt' },						this.element_content_random_custom_characters );
		this.element_content_random_custom_characters_input		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-random-line-input', 'type': 'text' },		this.element_content_random_custom_characters );
		this.element_content_random_character_count				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line' },							this.element_content_random );
		this.element_content_random_character_count_prompt		= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-random-line-prompt' },						this.element_content_random_character_count );
		this.element_content_random_character_count_input		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-random-line-input', 'type': 'text' },		this.element_content_random_character_count );

		this.element_content_random_level_radio.name						= 'RandomSource';
		this.element_content_random_custom_characters_radio.name			= 'RandomSource';

		this.element_content_random_level_radio.value						= 'level';
		this.element_content_random_custom_characters_radio.value			= 'custom';

		this.element_content_random_source_prompt.textContent				= 'Source';
		this.element_content_random_character_count_prompt.textContent		= 'Character Count';
		this.element_content_random_level_prompt.textContent				= 'Level';
		this.element_content_random_custom_characters_prompt.textContent	= 'Custom Characters';

		for ( i = 0, i_len = 53; i < i_len; i++ )
		{
			this.element_content_random_level_select.add( new Option( i + 1, i + 1 ) );
		}

		this.element_content_random_level_select.addEventListener(				'change', function( event ) { if ( self.random_level !== self.element_content_random_level_select.value ) self.random_level = self.element_content_random_level_select.value; },		false );
		this.element_content_random_level_radio.addEventListener(				'click', function( event ) { if ( self.random_source !== 'level' ) self.random_source = 'level'; },		false );
		this.element_content_random_custom_characters_radio.addEventListener(	'click', function( event ) { if ( self.random_source !== 'custom' ) self.random_source = 'custom'; },	false );
	}

	initialize_ui_content_file()
	{
		this.element_content_file							= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-file' },					this.element_content );
	}

	initialize_ui_content_callsign()
	{
		this.element_content_callsign						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-callsign' },				this.element_content );
	}

	initialize_ui_content_word()
	{
		this.element_content_word							= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-word' },					this.element_content );
	}

	initialize_ui_actionbar()
	{
		const self = this;

		this.element_actionbar								= this.newElement( 'span',	{ 'class': 'web-koch-trainer-actionbar' },										this.element_container );

		this.element_actionbar_char_speed					= this.newElement( 'label',	{ 'class': 'web-koch-trainer-actionbar-char-speed' },							this.element_actionbar );
		this.element_actionbar_char_speed_text				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-actionbar-char-speed-text' },						this.element_actionbar_char_speed );
		this.element_actionbar_char_speed_input				= this.newElement( 'input',	{ 'class': 'web-koch-trainer-actionbar-char-speed-input', 'type': 'text' },		this.element_actionbar_char_speed );
		this.element_actionbar_eff_speed					= this.newElement( 'label',	{ 'class': 'web-koch-trainer-actionbar-eff-speed' },							this.element_actionbar );
		this.element_actionbar_eff_speed_text				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-actionbar-eff-speed-text' },						this.element_actionbar_eff_speed );
		this.element_actionbar_eff_speed_input				= this.newElement( 'input',	{ 'class': 'web-koch-trainer-actionbar-eff-speed-input', 'type': 'text' },		this.element_actionbar_eff_speed );
		this.element_actionbar_hertz						= this.newElement( 'label',	{ 'class': 'web-koch-trainer-actionbar-hertz' },								this.element_actionbar );
		this.element_actionbar_hertz_text					= this.newElement( 'span',	{ 'class': 'web-koch-trainer-actionbar-hertz-text' },							this.element_actionbar_hertz );
		this.element_actionbar_hertz_input					= this.newElement( 'input',	{ 'class': 'web-koch-trainer-actionbar-hertz-input', 'type': 'text' },			this.element_actionbar_hertz );
		this.element_actionbar_spacer						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-actionbar-spacer' },								this.element_actionbar );
		this.element_actionbar_button						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-actionbar-button' },								this.element_actionbar );

		this.element_actionbar_char_speed_text.textContent	= 'Character Speed';
		this.element_actionbar_eff_speed_text.textContent	= 'Effective Speed';
		this.element_actionbar_hertz_text.textContent		= 'Hertz';

		this.element_actionbar_button.textContent			= 'Run';

		this.element_actionbar_button.tabIndex				= 0;
		this.element_actionbar_button.onclick				= function( event ) {  };

		this._event_button_mousedown						= function( event ) { return self.event_button_mousedown( event ? event : window.event ); };
		this._event_button_mouseup							= function( event ) { return self.event_button_mouseup( event ? event : window.event ); };

		this.element_actionbar_button.addEventListener( 'mousedown', this._event_button_mousedown, false );

		this.element_actionbar_char_speed_input.addEventListener( 'change', function( event )
		{
			if ( self.character_speed !== parseInt( self.element_actionbar_char_speed_input.value ) )
			{
				self.character_speed = parseInt( self.element_actionbar_char_speed_input.value );
			}
		}, false );

		this.element_actionbar_eff_speed_input.addEventListener( 'change', function( event )
		{
			if ( self.effective_speed !== parseInt( self.element_actionbar_eff_speed_input.value ) )
			{
				self.effective_speed = parseInt( self.element_actionbar_eff_speed_input.value );
			}
		}, false );

		this.element_actionbar_hertz_input.addEventListener( 'change', function( event )
		{
			if ( self.hertz !== parseInt( self.element_actionbar_hertz_input.value ) )
			{
				self.hertz = parseInt( self.element_actionbar_hertz_input.value );
			}
		}, false );
	}

	set_mode( mode )
	{
		this._mode = mode;

		classNameRemoveIfPresent( this.element_content, [ 'random', 'file', 'callsign', 'word' ] );
		classNameAddIfMissing( this.element_content, mode );
	}

	event_button_mousedown( e )
	{
		document.addEventListener(	'mouseup',	this._event_button_mouseup, false );
		window.addEventListener(	'blur',		this._event_button_mouseup, false );

		this.eventStopPropagation( e );
		return true;
	}

	event_button_mouseup( e )
	{
		var target = e.target;

		document.removeEventListener(	'mouseup',	this._event_button_mouseup, false );
		window.removeEventListener(		'blur',		this._event_button_mouseup, false );

		if ( target !== this.element_actionbar_button && !this.containsChild( this.element_actionbar_button, target ) )
		{
			return true;
		}

		this.generate_morse( 'Ryan', this._context.currentTime ); // TODO: Should disable button while running. Or enable "Cancel"

		this.eventStopPropagation( e );
		return this.eventPreventDefault( e );
	}

	newElement( type, attributes, parent )
	{
		let element, attribute;

		element = document.createElement( type );

		for ( attribute in attributes )
		{
			if ( !attributes.hasOwnProperty( attribute ) )
			{
				continue;
			}

			if ( attribute === 'name' )			element.name		= attributes[ attribute ];
			else if ( attribute === 'class' )	element.className	= attributes[ attribute ];
			else								element.setAttribute( attribute, attributes[ attribute ] );
		}

		if ( parent )
		{
			parent.appendChild( element );
		}

		return element;
	}

	containsChild( parent_elem, element )
	{
		if ( element )
		{
			while ( ( element = element.parentNode ) != null )
			{
				if ( element === parent_elem )
				{
					return true;
				}
			}
		}

		return false;
	}

	eventStopPropagation( event )
	{
		if ( event.stopPropagation )
		{
			return event.stopPropagation();
		}

		event.cancelBubble = true;
	}

	eventPreventDefault( event )
	{
		if ( event.preventDefault )
		{
			return event.preventDefault();
		}

		event.returnValue = false;

		return false;
	}

	defaults()
	{
		this._file				= null;

		this._callsign_mode		= false;
		this._callsign_count	= 20;

		this._word_mode			= false;
		this._word_count		= 20;
		this._word_char_min		= 1;
		this._word_char_max		= 5;
		this._word_file			= null;
		this._word_separators	= [ ' ' ];

		this._morse_text		= '';
		this._morse_display		= [];

		//
		// Generic
		//

		if ( !this.hasAttribute( 'mode' ) )						this.mode						= 'random';
		if ( !this.hasAttribute( 'character-speed' ) )			this.character_speed			= 20;
		if ( !this.hasAttribute( 'effective-speed' ) )			this.effective_speed			= 20;
		if ( !this.hasAttribute( 'hertz' ) )					this.hertz						= 550;

		//
		// Random Mode
		//

		if ( !this.hasAttribute( 'random-source' ) )			this.random_source				= 'level';
		if ( !this.hasAttribute( 'random-character-count' ) )	this.random_character_count		= 100;
		if ( !this.hasAttribute( 'random-level' ) )				this.random_level				= 53;
		if ( !this.hasAttribute( 'random-custom-characters' ) )	this.random_custom_characters	= '';

		//
		// Word Mode
		//

		//
		// Callsign Mode
		//

		//
		// File Mode
		//

		if ( !this.hasAttribute( 'file' ) )						this.file						= '';
	}

	update_timing()
	{
		let t_a					= ( 60 * this.character_speed - 37.2 * this.effective_speed ) / ( this.character_speed * this.effective_speed )

		this._dit				= 1.2 / this.character_speed;
		this._dah				= this._dit * 3;
		this._inter_symbol		= this._dit;
		this._inter_letter		= ( t_a * 3 ) / 19.0;
		this._inter_word		= ( t_a * 7 ) / 19.0;
	}

	get mode()								{ return this.getAttribute( 'mode' ); }
	set mode( value )						{ this.setAttribute( 'mode', value ); }

	get random_source()						{ return this.getAttribute( 'random-source' ); }
	set random_source( value )				{ this.setAttribute( 'random-source', value ); }

	get random_level()						{ return this.getAttribute( 'random-level' ); }
	set random_level( value )				{ this.setAttribute( 'random-level', value ); }

	get random_character_count()			{ return this.getAttribute( 'random-character-count' ); }
	set random_character_count( value )		{ this.setAttribute( 'random-character-count', value ); }

	get character_speed()					{ return this.getAttribute( 'hertz' ); }
	set character_speed( value )			{ this.setAttribute( 'character-speed', value ); }

	get effective_speed()					{ return this.getAttribute( 'effective-speed' ); }
	set effective_speed( value )			{ this.setAttribute( 'effective-speed', value ); }

	get random_custom_characters()			{ return this.getAttribute( 'random-custom-characters' ); }
	set random_custom_characters( value )	{ this.setAttribute( 'random-custom-characters', value ); }

	get file()						{ return this.getAttribute( 'file' ); }
	set file( value )				{ this.setAttribute( 'file', value ); }

	get hertz()						{ return this.getAttribute( 'hertz' ); }
	set hertz( value )				{ this.setAttribute( 'hertz', value ); }

	get callsign_mode()				{ return this.getAttribute( 'callsign-mode' ); }
	set callsign_mode( value )		{ this.setAttribute( 'callsign-mode', value ); }

	get callsign_count()			{ return this.getAttribute( 'callsign-count' ); }
	set callsign_count( value )		{ this.setAttribute( 'callsign-count', value ); }

	get word_mode()					{ return this.getAttribute( 'word-mode' ); }
	set word_mode( value )			{ this.setAttribute( 'word-mode', value ); }

	get word_count()				{ return this.getAttribute( 'word-count' ); }
	set word_count( value )			{ this.setAttribute( 'word-count', value ); }

	get word_char_min()				{ return this.getAttribute( 'word-char-min' ); }
	set word_char_min( value )		{ this.setAttribute( 'word-char-min', value ); }

	get word_char_max()				{ return this.getAttribute( 'word-char-max' ); }
	set word_char_max( value )		{ this.setAttribute( 'word-char-max', value ); }

	get word_file()					{ return this.getAttribute( 'word-file' ); }
	set word_file( value )			{ this.setAttribute( 'word-file', value ); }

	get word_separators()			{ return this.getAttribute( 'word-separators' ); }
	set word_separators( value )	{ this.setAttribute( 'word-separators', value ); }

	//
	// Attributes
	//

	static get observedAttributes()
	{
		return [ 'mode', 'character-speed', 'effective-speed', 'hertz', 'random-source', 'random-level', 'random-character-count', 'random-custom-characters', 'file', 'callsign-mode', 'callsign-count', 'word-mode', 'word-count', 'word-char-min', 'word-char-max', 'word-file', 'word-separators' ];
	}

	attributeChangedCallback( name, oldValue, newValue )
	{
		switch ( name )
		{
			case 'mode':
				this.set_mode( newValue );

				break;
			case 'character-speed':
				this._dot										= 1.2 / newValue;
				this._character_speed							= newValue;
				this.element_actionbar_char_speed_input.value	= newValue;

				this.update_timing();

				break;
			case 'effective-speed':

				this._effective_speed							= Math.max( this.character_speed, newValue )
				this.element_actionbar_eff_speed_input.value	= newValue;

				this.update_timing();

				break;
			case 'hertz':
				this._hertz										= newValue;
				this._oscillator.frequency.value				= newValue;
				this.element_actionbar_hertz_input.value		= newValue;

				break;
			case 'random-source':
				this._random_source = newValue;

				if ( newValue === 'level' )	this.element_content_random_level_radio.checked = true;
				else						this.element_content_random_custom_characters_radio.checked = true;

				break;
			case 'random-level':
				this._random_level								= newValue;
				this._random_characters							= this._character_sequence.slice( 0, parseInt( newValue ) );
				this.element_content_random_level_select.value	= newValue;

				break;
			case 'random-character-count':
				this._random_character_count							= newValue;
				this.element_content_random_character_count_input.value	= newValue;

				break;
			case 'random-custom-characters':
				this._random_custom_characters								= newValue;
				this._random_characters										= newValue;
				this.element_content_random_custom_characters_input.value	= newValue;

				break;
			case 'file':
				break;
			case 'callsign-mode':
				break;
			case 'callsign-count':
				break;
			case 'word-mode':
				break;
			case 'word-count':
				break;
			case 'word-char-min':
				break;
			case 'word-char-max':
				break;
			case 'word-file':
				break;
			case 'word-separators':
				break;
		}
	}

	generate_morse( text, time )
	{
		let c, char;

		text				= text.toUpperCase();
		this.morse_display	= [];

		for ( let c of text )
		{
			if ( c === ' ' )
			{
				time += 3 * this._dot;
			}
			else if ( this._letters[ c ] !== undefined )
			{
				time = this.createSound( time, this._letters[ c ] );
				time += 2 * this._dot;
			}

			char		= new MorseCharacter();
			char.text	= c;
			char.value	= this._letters[ c ];

			this.morse_display.push( char );
		}

		return time;
	}

	createSound( time, char )
	{
		for ( let c of char )
		{
			switch ( c )
			{
				case '.':
					this._gain.gain.setTargetAtTime( 1.0, time, 0.005 );
					time += this._dot;
					this._gain.gain.setTargetAtTime( 0.0, time, 0.005 );
					break;
				case '-':
					this._gain.gain.setTargetAtTime( 1.0, time, 0.005 );
					time += 3 * this._dot;
					this._gain.gain.setTargetAtTime( 0.0, time, 0.005 );
					break;
			}

			time += this._dot;
		}

		return time;
	}
}

class MorseCharacter
{
	text;
	value;
}

function classNameAddIfMissing( element, classname )
{
	let classes_new, classes_old, classname_new, classname_old;

	classes_old = element.className.split( /\s/ ).map( function( value ) { return value.replace( /^\s+|\s+$/g, '' ); } ).filter( function( value ) { return value !== ''; } );
	classes_new = classes_old.filter( function( value )
	{
		if ( Array.isArray( classname ) )	return classname.indexOf( value ) === -1;
		else								return value !== classname;
	} );

	if ( Array.isArray( classname ) )	classes_new = classes_new.concat( classname );
	else								classes_new.push( classname );

	classes_new.push( classname );

	classes_new.sort();
	classes_old.sort();

	classname_new = classes_new.join( ' ' );
	classname_old = classes_old.join( ' ' );

	if ( classname_new !== classname_old )
	{
		element.className = classes_new.join( ' ' );
	}
}

function classNameRemoveIfPresent( element, classname )
{
	let classes_new, classes_old, classname_new, classname_old;

	classes_old = element.className.split( /\s/ ).map( function( value ) { return value.replace( /^\s+|\s+$/g, '' ); } ).filter( function( value ) { return value !== ''; } );
	classes_new = classes_old.filter( function( value )
	{
		if ( Array.isArray( classname ) )	return classname.indexOf( value ) === -1;
		else								return value !== classname;
	} );

	classes_new.sort();
	classes_old.sort();

	classname_new = classes_new.join( ' ' );
	classname_old = classes_old.join( ' ' );

	if ( classname_new !== classname_old )
	{
		element.className = classes_new.join( ' ' );
	}
}

customElements.define( 'web-koch-trainer', WebKochTrainer );