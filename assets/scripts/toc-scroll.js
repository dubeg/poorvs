// ==================================
// TableOfContent scroller
//
// Description:
// this mimics the behavior of position
// sticky for an element.
//
// Note:
// This should be reworked to be usable for other uses,
// but that won't happen until I need it for something else.
// ==================================
var tocScroll = {
	_element : null, // static element
	_elementParent : null, // static node containing element.
	_isTicking : false,
	_isHooked : false,
	_handlerOnScroll : null,
	_handlerOnResize : null,
	_topOffset : 16, // in pixels

	Init: function(elementClass)
	{
		// Animating any property on a relatively postionned element isnt smooth.
		// Instead, lets put a hidden clone of the element so that the container keeps its dimensions, and fix the list on the viewport when the viewport is scrolled below the list's static position.

		this._handlerOnScroll = this.onScroll.bind(this);
		this._handlerOnResize = this.onResize.bind(this);

		let elements = document.getElementsByClassName(elementClass);
		if (elements.length < 1)
			return false;

		this._element = elements.item(0);
		this._elementParent = this._element.parentElement;
		if (this._elementParent == null)
			return false;

		let cloneElement = this._element.cloneNode(true);
		cloneElement.className += " clone";
		cloneElement.style.visibility = "hidden";
		this._elementParent.appendChild(cloneElement);
		
		// Update on page load, before any
		// scrolling/resizing can occur.
		this.requestTick();
		return true;
	},
	Start: function()
	{
		if (!this._isHooked)
		{
			document.addEventListener("scroll", this._handlerOnScroll, false);
			window.addEventListener("resize", this._handlerOnResize, false);
			this._isHooked = true;
		}
	},
	Stop: function()
	{
		if(this._isHooked)
		{
			document.removeEventListener("scroll", this._handlerOnScroll, false);
			window.removeEventListener("resize", this._handlerOnResize, false);
			this._isHooked = false;
		}
	},
	onScroll: function()
	{
		this.requestTick();
	},
	onResize : function()
	{
		this.requestTick();
	},
	requestTick: function()
	{
		if (this._isTicking == false)
		{
			this._isTicking = true;
			window.requestAnimationFrame(this.updateElement.bind(this));
		}
	},
	updateElement: function()
	{
		var bounds = this._elementParent.getBoundingClientRect();
		if (bounds.top <= this._topOffset)
		{
			this._element.style.position = "fixed";
			this._element.style.width = bounds.width + "px";
			this._element.style.top = this._topOffset + "px";
			this._element.style.left = bounds.left + "px";
		}
		else
		{
			this._element.style.position = "";
			this._element.style.width = "";
			this._element.style.left = "";
			this._element.style.top = "";
		}
		this._isTicking = false;
	}
}