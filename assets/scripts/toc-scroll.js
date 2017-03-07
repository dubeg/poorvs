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
	_fixedElement : null, // 
	_element : null, // static element
	_elementParent : null, // static node containing element.
	_isTicking : false,
	_isHooked : false,
	_handlerOnScroll : null,
	_handlerOnResize : null,
	_topOffset : 16, // in pixels

	Init: function(elementId)
	{
		// Animating any property on a relatively postionned element wont be smooth.
		// I tried relative/top, relative/translate, both were jerky.
		// Therefore, lets create a clone of the element and fix it on the viewport.

		this._handlerOnScroll = this.onScroll.bind(this);
		this._handlerOnResize = this.onResize.bind(this);

		this._element = document.getElementById(elementId);
		if (this._element == null)
			return false;

		this._elementParent = this._element.parentElement;
		if (this._elementParent == null)
			return false;

		this._fixedElement = this._element.cloneNode(true);
		this._fixedElement.id += "-stickied";
		this._fixedElement.style.visibility = "hidden";
		this._fixedElement.style.position = "fixed";
		this._fixedElement.style.top = this._topOffset + "px";
		this._elementParent.appendChild(this._fixedElement);

		return true;
	},
	Start: function()
	{
		if (!this._isHooked)
		{
			// dubeg: this fixes the case where you would reload
			// an already scrolled-down viewport and the fixed TOC wouldn't appear.
			//this.requestTick();

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
		// 16px, because outline container has padding (1rem)
		if (bounds.top <= this._topOffset)
		{
			this._element.style.visibility = "hidden";
			this._fixedElement.style.visibility = "visible";
			this._fixedElement.style.width = bounds.width + "px";
			this._fixedElement.style.left = bounds.left + "px";
		}
		else
		{
			this._element.style.visibility = "visible";
			this._fixedElement.style.visibility = "hidden";
		}
		this._isTicking = false;
	}
}