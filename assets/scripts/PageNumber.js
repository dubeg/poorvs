// =====================================================
// Display Page Number
// =====================================================
var pageNbrUtil = {
	_visibleClass : "visible",
	_hiddenfieldPageNbrID : "pageNbr",
	_lblPageNbrID : "lblHeaderPageNbr",

	_hiddenfieldPageNbr : null,
	_lblPageNbr : null,

	_pageNbr : null,

	// ----------------------------------
	// Init
	// ----------------------------------
	Init: function()
	{
		var success = false;

		this._lblPageNbr = document.getElementById(this._lblPageNbrID);
		this._hiddenfieldPageNbr  = document.getElementById(this._hiddenfieldPageNbrID);

		if( this._lblPageNbr != null && this._hiddenfieldPageNbr != null)
		{
			this._pageNbr = parseInt(this._hiddenfieldPageNbr.value);
			if(Number.isInteger(this._pageNbr))
				success = true; 
		}

		return success;
	},

	// ----------------------------------
	// Update Label
	// ----------------------------------
	UpdateLabel: function()
	{
		if( this._pageNbr > 1 && this._lblPageNbr !== null )
		{
			this._lblPageNbr.classList.toggle(this._visibleClass);
		}
	},
}