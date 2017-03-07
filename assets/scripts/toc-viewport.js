// 1. Iterate through all sections in post.
// 2. Get top and bottom position foreach section.
var tocViewport = {

	_isTicking : false,
	_isHooked : false,
	_sections : null,

	Init: function()
	{
        this._sections = this.getSections();
		this.setInView(this._sections);
		this._handlerOnScroll = this.onScroll.bind(this);
		this._handlerOnResize = this.onResize.bind(this);
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
			window.requestAnimationFrame(this.onTick.bind(this));
		}
	},
	onTick: function()
	{
        // Fn body here.
        // ...
        // --------------------
		this.setInView(this._sections);
		this._isTicking = false;
	},
    // =================================================
    getSections: function()
    {
        // Scan sections.
        // Get top and bottom foreach section.
        let parent = document.getElementById("post");
        let children = parent.querySelectorAll(".post-content > *");

		let sections = [];

        let child = null;
		let childName = "";
		let rect;
		let top = 0;
		let bottom = 0;
		let index = 0;
		let sectionName = "";

		if(children.length > 0)
		{
			// 1st case
			child = children[0];
			rect = this.getCoords(child);
			top = rect.top;
			bottom = rect.bottom;
			sectionName = "title";
			index = 0;

			// [2, N-1] case
			for(let i = 1; i < children.length; ++i)
			{
				child = children[i];
				childName = child.tagName.toUpperCase();
				if (childName == "H1" || 
					childName == "H2" ||
					childName == "H3" ||
					childName == "H4" ||
					childName == "H5" ||
					childName == "H6" ) 
				{
					// Push previous section on new heading.
					sections.push({ sectionName: sectionName, top: top, bottom: bottom, index: index });

					rect = this.getCoords(child);
					top = rect.top;
					bottom = rect.bottom;
					sectionName = child.innerHTML;
					index += 1;
				}
				else 
				{
					bottom = this.getCoords(child).bottom;
				}
			}

			// Last case
			if(sections.length > 1)
			{
				sections.push({ sectionName: sectionName, top: top, bottom: bottom, index: index });
			}
		}
		return sections;
    },
	getCoords: function(elem) { // crossbrowser version
		let box = elem.getBoundingClientRect();

		let body = document.body;
		let docEl = document.documentElement;

		let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		let clientTop = docEl.clientTop || body.clientTop || 0;

		let top  = box.top +  scrollTop - clientTop;
		let bottom = top + box.height;

		return { 
			top: Math.round(top), 
			bottom: Math.round(bottom) 
		};
	},
	setInView: function(sections)
	{
		let viewportTop = window.scrollY;
		let viewportBottom = window.innerHeight + viewportTop;

		this.log("ViewportTop: " + viewportTop);
		this.log("ViewportBot: " + viewportBottom);

		for(let i = 0; i < sections.length; ++i)
		{
			let section = sections[i];
			let isInView = false;

			if ((viewportTop >= section.top && viewportTop <= section.bottom) ||
				(viewportBottom >= section.top && viewportBottom <= section.bottom) ||
				(section.top >= viewportTop && section.bottom <= viewportBottom)) 
				isInView = true;
			
			this.log(
				"Visible:" + isInView 
				+ " | " + section.index 
				+ " " + section.top + "-" + section.bottom);

			let className = "toc-item-" + section.index;
			let elements = document.getElementsByClassName(className)
			if(elements.length > 0) {
				for(let j = 0; j < elements.length; ++j)
					if (isInView)
						elements[j].classList.add("in-view");
					else 
						elements[j].classList.remove("in-view");
			}
		}
	},
	log: function(msg)
	{
		//console.log(msg);
	}
}