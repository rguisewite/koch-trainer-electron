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
		this.element_header_tab_callsign					= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tab' },						this.element_header_tabs );
		this.element_header_tab_word						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-header-tab' },						this.element_header_tabs );

		this.element_header_tab_random.textContent			= 'Random';
		this.element_header_tab_callsign.textContent		= 'Call Sign';
		this.element_header_tab_word.textContent			= 'Word';

		this.element_header_tab_random.addEventListener(	'click', function( event ) { self.mode = 'random'; },	false );
		this.element_header_tab_callsign.addEventListener(	'click', function( event ) { self.mode = 'callsign'; },	false );
		this.element_header_tab_word.addEventListener(		'click', function( event ) { self.mode = 'word'; },		false );
	}

	initialize_ui_content()
	{
		this.element_content			= this.newElement( 'span', { 'class': 'web-koch-trainer-content' },						this.element_container );
		this.element_content_settings	= this.newElement( 'span', { 'class': 'web-koch-trainer-content-settings-container' },	this.element_content );
		this.element_content_view		= this.newElement( 'span', { 'class': 'web-koch-trainer-content-view' },				this.element_content );

		this.initialize_ui_content_random();
		this.initialize_ui_content_callsign();
		this.initialize_ui_content_word();
	}

	initialize_ui_content_random()
	{
		const self = this;
		let i, i_len;

		this.element_content_random								= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings random' },							this.element_content_settings );
		this.element_content_random_source						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },								this.element_content_random );
		this.element_content_random_source_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },						this.element_content_random_source );
		this.element_content_random_source_select				= this.newElement( 'select',{ 'class': 'web-koch-trainer-content-settings-line-select' },						this.element_content_random_source );
		this.element_content_random_level						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line level' },						this.element_content_random );
		this.element_content_random_level_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },						this.element_content_random_level );
		this.element_content_random_level_select				= this.newElement( 'select',{ 'class': 'web-koch-trainer-content-settings-line-select' },						this.element_content_random_level );
		this.element_content_random_custom_characters			= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line custom' },						this.element_content_random );
		this.element_content_random_custom_characters_prompt	= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },						this.element_content_random_custom_characters );
		this.element_content_random_custom_characters_input		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-input', 'type': 'text' },		this.element_content_random_custom_characters );
		this.element_content_random_character_count				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },								this.element_content_random );
		this.element_content_random_character_count_prompt		= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },						this.element_content_random_character_count );
		this.element_content_random_character_count_input		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-input', 'type': 'text' },		this.element_content_random_character_count );

		this.element_content_random_source_prompt.textContent				= 'Source';
		this.element_content_random_character_count_prompt.textContent		= 'Character Count';
		this.element_content_random_level_prompt.textContent				= 'Level';
		this.element_content_random_custom_characters_prompt.textContent	= 'Custom Characters';

		this.element_content_random_source_select.add( new Option( 'Level',				'level' ) );
		this.element_content_random_source_select.add( new Option( 'Custom Characters',	'custom' ) );

		for ( i = 0, i_len = 53; i < i_len; i++ )
		{
			this.element_content_random_level_select.add( new Option( i + 1, i + 1 ) );
		}

		this.element_content_random_source_select.addEventListener(				'change',	function( event ) { if ( self.random_source !== self.element_content_random_source_select.value ) self.random_source = self.element_content_random_source_select.value; },		false );
		this.element_content_random_level_select.addEventListener(				'change',	function( event ) { if ( self.random_level !== self.element_content_random_level_select.value ) self.random_level = self.element_content_random_level_select.value; },		false );
		this.element_content_random_custom_characters_input.addEventListener(	'change',	function( event ) { if ( self.random_custom_characters !== self.element_content_random_custom_characters_input.value ) self.random_custom_characters = self.element_content_random_custom_characters_input.value; },		false );
		this.element_content_random_character_count_input.addEventListener(		'change',	function( event ) { if ( self.random_character_count !== self.element_content_random_character_count_input.value ) self.random_character_count = self.element_content_random_character_count_input.value; },		false );
	}

	initialize_ui_content_callsign()
	{
		const self = this;

		this.element_content_callsign							= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings callsign' },							this.element_content_settings );
		this.element_content_callsign_count						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },								this.element_content_callsign );
		this.element_content_callsign_count_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },						this.element_content_callsign_count );
		this.element_content_callsign_count_input				= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-input', 'type': 'text' },		this.element_content_callsign_count );

		this.element_content_callsign_count_prompt.textContent	= 'Callsign Count';

		this.element_content_callsign_count_input.addEventListener( 'change', function( event ) { if ( self.callsign_count !== self.element_content_callsign_count_input.value ) self.callsign_count = self.element_content_callsign_count_input.value; },		false );
	}

	initialize_ui_content_word()
	{
		this.element_content_word								= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings word' },									this.element_content_settings );
		this.element_content_word_count							= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },									this.element_content_word );
		this.element_content_word_count_prompt					= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },							this.element_content_word_count );
		this.element_content_word_count_input					= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-input', 'type': 'text' },			this.element_content_word_count );
		this.element_content_word_char_min						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },									this.element_content_word );
		this.element_content_word_char_min_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },							this.element_content_word_char_min );
		this.element_content_word_char_min_input				= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-input', 'type': 'text' },			this.element_content_word_char_min );
		this.element_content_word_char_max						= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },									this.element_content_word );
		this.element_content_word_char_max_prompt				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt' },							this.element_content_word_char_max );
		this.element_content_word_char_max_input				= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-input', 'type': 'text' },			this.element_content_word_char_max );
		this.element_content_word_separator_comma				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },									this.element_content_word );
		this.element_content_word_separator_comma_checkbox		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-checkbox', 'type': 'checkbox' },		this.element_content_word_separator_comma );
		this.element_content_word_separator_comma_prompt		= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt-checkbox' },					this.element_content_word_separator_comma );
		this.element_content_word_separator_period				= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },									this.element_content_word );
		this.element_content_word_separator_period_checkbox		= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-checkbox', 'type': 'checkbox' },		this.element_content_word_separator_period );
		this.element_content_word_separator_period_prompt		= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt-checkbox' },					this.element_content_word_separator_period );
		this.element_content_word_separator_question			= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line' },									this.element_content_word );
		this.element_content_word_separator_question_checkbox	= this.newElement( 'input',	{ 'class': 'web-koch-trainer-content-settings-line-checkbox', 'type': 'checkbox' },		this.element_content_word_separator_question );
		this.element_content_word_separator_question_prompt		= this.newElement( 'span',	{ 'class': 'web-koch-trainer-content-settings-line-prompt-checkbox' },					this.element_content_word_separator_question );

		this.element_content_word_count_prompt.textContent				= 'Word Count';
		this.element_content_word_char_min_prompt.textContent			= 'Word Min Length';
		this.element_content_word_char_max_prompt.textContent			= 'Word Max Length';
		this.element_content_word_separator_comma_prompt.textContent	= 'Include Comma';
		this.element_content_word_separator_period_prompt.textContent	= 'Include Period';
		this.element_content_word_separator_question_prompt.textContent	= 'Include Question Mark';

		this.element_content_word_count_input.addEventListener( 'change', function( event ) { if ( self.word_count !== self.element_content_word_count_input.value ) self.word_count = self.element_content_word_count_input.value; },		false );
		this.element_content_word_char_min_input.addEventListener( 'change', function( event ) { if ( self.word_char_min !== self.element_content_word_char_min_input.value ) self.word_char_min = self.element_content_word_char_min_input.value; },		false );
		this.element_content_word_char_max_input.addEventListener( 'change', function( event ) { if ( self.word_char_max !== self.element_content_word_char_max_input.value ) self.word_char_max = self.element_content_word_char_max_input.value; },		false );
		this.element_content_word_separator_comma_checkbox.addEventListener( 'click', function( event ) { if ( self.word_comma !== self.element_content_word_separator_comma_checkbox.checked ) self.word_comma = self.element_content_word_separator_comma_checkbox.checked; },		false );
		this.element_content_word_separator_period_checkbox.addEventListener( 'click', function( event ) { if ( self.word_period !== self.element_content_word_separator_period_checkbox.checked ) self.word_period = self.element_content_word_separator_period_checkbox.checked; },		false );
		this.element_content_word_separator_question_checkbox.addEventListener( 'click', function( event ) { if ( self.word_question !== self.element_content_word_separator_question_checkbox.checked ) self.word_question = self.element_content_word_separator_question_checkbox.checked; },		false );
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

		classNameRemoveIfPresent( this.element_content_settings, [ 'random', 'callsign', 'word' ] );
		classNameAddIfMissing( this.element_content_settings, mode );
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

		if ( !this.hasAttribute( 'mode' ) )						this.mode						= this.storage_value_or_default( 'mode',			'random' );
		if ( !this.hasAttribute( 'character-speed' ) )			this.character_speed			= this.storage_value_or_default( 'character-speed',	20 );
		if ( !this.hasAttribute( 'effective-speed' ) )			this.effective_speed			= this.storage_value_or_default( 'effective-speed',	20 );
		if ( !this.hasAttribute( 'hertz' ) )					this.hertz						= this.storage_value_or_default( 'hertz',			550 );

		//
		// Random Mode
		//

		if ( !this.hasAttribute( 'random-source' ) )			this.random_source				= this.storage_value_or_default( 'random-source',				'level' );
		if ( !this.hasAttribute( 'random-character-count' ) )	this.random_character_count		= this.storage_value_or_default( 'random-character-count',		100 );
		if ( !this.hasAttribute( 'random-level' ) )				this.random_level				= this.storage_value_or_default( 'random-level',				53 );
		if ( !this.hasAttribute( 'random-custom-characters' ) )	this.random_custom_characters	= this.storage_value_or_default( 'random-custom-characters',	'' );

		//
		// Word Mode
		//

		if ( !this.hasAttribute( 'word-count' ) )				this.word_count					= this.storage_value_or_default( 'word-count',		20 );
		if ( !this.hasAttribute( 'word-char-min' ) )			this.word_char_min				= this.storage_value_or_default( 'word-char-min',	2 );
		if ( !this.hasAttribute( 'word-char-max' ) )			this.word_char_max				= this.storage_value_or_default( 'word-char-max',	5 );
		if ( !this.hasAttribute( 'word-comma' ) )				this.word_comma					= this.storage_value_or_default( 'word-comma',		false );
		if ( !this.hasAttribute( 'word-period' ) )				this.word_period				= this.storage_value_or_default( 'word-period',		false );
		if ( !this.hasAttribute( 'word-question' ) )			this.word_question				= this.storage_value_or_default( 'word-question',	false );
		if ( !this.hasAttribute( 'word-file' ) )				this.word_file					= this.storage_value_or_default( 'word-file',		'' ); // TODO: Maybe this should be a "textarea" to paste content into?

		//
		// Callsign Mode
		//

		if ( !this.hasAttribute( 'callsign-count' ) )			this.callsign_count				= this.storage_value_or_default( 'callsign-count',	20 );
	}

	storage_value_or_default( key, default_value )
	{
		let value;

		if ( ( value = localStorage.getItem( key ) ) === null )
		{
			return default_value;
		}

		return value;
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

	get word_comma()				{ return this.getAttribute( 'word-comma' ); }
	set word_comma( value )			{ this.setAttribute( 'word-comma', value ); }

	get word_period()				{ return this.getAttribute( 'word-period' ); }
	set word_period( value )		{ this.setAttribute( 'word-period', value ); }

	get word_question()				{ return this.getAttribute( 'word-question' ); }
	set word_question( value )		{ this.setAttribute( 'word-question', value ); }

	//
	// Attributes
	//

	static get observedAttributes()
	{
		return [ 'mode', 'character-speed', 'effective-speed', 'hertz', 'random-source', 'random-level', 'random-character-count', 'random-custom-characters', 'callsign-mode', 'callsign-count', 'word-mode', 'word-count', 'word-char-min', 'word-char-max', 'word-file', 'word-comma', 'word-period', 'word-question' ];
	}

	attributeChangedCallback( name, oldValue, newValue )
	{
		localStorage.setItem( name, newValue );

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
				this._random_source								= newValue;
				this.element_content_random_source_select.value	= newValue;

				classNameRemoveIfPresent( this.element_content_random, 'level' );
				classNameRemoveIfPresent( this.element_content_random, 'custom' );
				classNameAddIfMissing( this.element_content_random, newValue );

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
			case 'callsign-mode':
				break;
			case 'callsign-count':
				this._callsign_count							= newValue;
				this.element_content_callsign_count_input.value	= newValue;

				break;
			case 'word-mode':
				break;
			case 'word-count':
				this.element_content_word_count_input.value = newValue;
				break;
			case 'word-char-min':
				this.element_content_word_char_min_input.value = newValue;
				break;
			case 'word-char-max':
				this.element_content_word_char_max_input.value = newValue;
				break;
			case 'word-file':
				break;
			case 'word-comma':
				this.element_content_word_separator_comma_checkbox.checked = newValue;
				break;
			case 'word-period':
				this.element_content_word_separator_period_checkbox.checked = newValue;
				break;
			case 'word-question':
				this.element_content_word_separator_question_checkbox.checked = newValue;
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