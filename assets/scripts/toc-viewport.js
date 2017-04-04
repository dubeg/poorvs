// ==================================
// TableOfContent viewport indicator
//
// Description:
// this utility inserts and updates a line (represented by a div)
// that should be located next to the TOC list.
//
// The line should only be next to the TOC items
// related to the sections visible in the viewport.
// ==================================
var tocViewport = {
	_metadataCalculated : false,
	_isTicking : false,
	_isHooked : false,
	_sections : null,
	_toc : null,
	_indicator : null,
	_items : null,

	Init: function()
	{
		let tocParent = document.getElementById("toc");
		if (tocParent == null) return false;

		this._toc = tocParent.querySelector(".toc-container:not(.clone)");
		if (this._toc == null) return false;
		this._indicator = this.insertIndicator(this._toc);

		// Update on page load, before any
		// scrolling/resizing can occur.
		this.requestTick();
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
		this._metadataCalculated = false;
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
		if(this._metadataCalculated || this.updateMetadata())
		{
			let sections = this.getSectionsInViewport(this._sections);
			this.updateViewportIndicator(sections);
		}
		// --------------------
		this._isTicking = false;
	},
	// ----------------------------------------
	// Get metadata on TOC items.
	// Note:
	// These are used to animate the TOC's 
	// viewport indicator.
	// ----------------------------------------
	getItems: function()
	{
		let toc = this._toc;
		let itemInfos = [];
		let items = toc.getElementsByClassName("toc-item");
		for(let i = 0; i < items.length; ++i)
		{
			let item = items[i];
			let anchor = item.querySelector("a");
			let anchorRect = anchor.getBoundingClientRect();
			
			//let styles = window.getComputedStyle(item, null);
			//let lineHeight = styles.getPropertyValue("line-height");

			let top = item.offsetTop;
			//let height = Number.parseInt(lineHeight.slice(0, -2));
			height = anchorRect.height;

			itemInfos.push({
				class: item.className,
				height: height,
				top: top
			});
		}
		return itemInfos;
	},
	// ----------------------------------------
	// Get list of metadata on sections of the document.
	// Note:
	// These are used to determine which sections
	// are currently in the viewport.
	// ----------------------------------------
    getSections: function()
    {
        let parent = document.getElementById("post");
		let title = parent.querySelector(".post-header");
        let children = parent.querySelectorAll(".post-content > *");
		let sections = [];

		if(children.length > 0)
		{
			let child = null;
			let rect;

			let top = 0;
			let bottom = 0;
			let index = 0;
			let name = "";
			let i = 0;

			// 1st case
			name = "title";
			index = 0;
			rect = this.getCoords(title);
			top = rect.top;
			bottom = rect.bottom;

			// [2, N-1] case
			for(; i < children.length; ++i)
			{
				child = children[i];
				if (this.isHeader(child.tagName)) 
				{
					// Push previous section on new heading.
					sections.push({ sectionName: name, top: top, bottom: bottom, index: index });

					rect = this.getCoords(child);
					top = rect.top;
					bottom = rect.bottom;
					name = child.innerHTML;
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
				sections.push({ 
					sectionName: name, 
					top: top, 
					bottom: bottom, 
					index: index
				});
			}
		}

		return sections;
    },
	isHeader: function(tagName)
	{
		tagName = tagName.toUpperCase();
		if (tagName == "H1" || 
			tagName == "H2" ||
			tagName == "H3" ||
			tagName == "H4" ||
			tagName == "H5" ||
			tagName == "H6" )
			return true
		else
			return false
	},
	// ----------------------------------------
	// Get top & bottom of a element relative
	// to the document.
	// ----------------------------------------
	getCoords: function(elem) 
	{
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
	// ----------------------------------------
	// Get list of metadata on sections visible
	// in the viewport.
	// ----------------------------------------
	getSectionsInViewport: function(sections)
	{
		let sectionsInViewport = [];
		let viewportTop = window.scrollY;
		let viewportBottom = window.innerHeight + viewportTop;

		//console.clear();
		//console.log("ViewportTop: " + viewportTop);
		//console.log("ViewportBot: " + viewportBottom);

		for(let i = 0; i < sections.length; ++i)
		{
			let section = sections[i];
			let isInView = false;

			// Case A: section is entirely within the viewport.
			// Case B: section is extending past viewportBottom, and sectionTop is in the viewport.
			// Case C: section is extending past viewportTop, and sectionBottom is in the viewport. 
			// Case D: section is extending past viewportTop and viewportBottom.

			// Solution 2 (slightly better)
			// 1st condition takes care of case A & B.
			// 2nd condition takes care of case C & D.
			if ((viewportTop <= section.top && viewportBottom >= section.top) ||
			    (viewportTop >= section.top && viewportTop <= section.bottom))
			{
				isInView = true;
				sectionsInViewport.push(section);
				//console.log(section.index + " " + section.top + "-" + section.bottom + " " + section.sectionName);
			}
			this.setClassOnItemsInView(section, isInView);
		}
		return sectionsInViewport;
	},
	// ----------------------------------------
	// Set a class on TOC items related to
	// headings visible in the viewport.
	// Note:
	// Used to debug.
	// ----------------------------------------
	setClassOnItemsInView: function(section, isInView)
	{
		let className = "toc-item-" + section.index;
		let elements = document.getElementsByClassName(className)
		if(elements.length > 0) 
		{
			for(let j = 0; j < elements.length; ++j)
				if (isInView)
					elements[j].classList.add("in-view");
				else 
					elements[j].classList.remove("in-view");
		}
	},
	// ----------------------------------------
	// Update the TOC's viewport indicator.
	// Note:
	// The indicator is a line to the side of the list,
	// that should be next to the TOC items in the viewport.
	// ----------------------------------------
	updateViewportIndicator: function(sectionsInViewport)
	{
		let indicator = this._indicator;
		let toc = this._toc;
		let items = this._items;
		let indicators = document.getElementsByClassName("toc-viewport");
		
		// Get infos
		// ----------
		let firstItem = items[sectionsInViewport[0].index];
		let lastItem = items[sectionsInViewport[sectionsInViewport.length - 1].index];
		
		let top = firstItem.top;
		let height = lastItem.top + lastItem.height - top;

		// Update indicators
		// -----------------
		indicator.style.height = height + "px";
		indicator.style.top = top + "px";
	},
	// ----------------------------------------
	// Insert the TOC's viewport indicator.
	// Note:
	// It will be inserted in the TOC container element.
	// ----------------------------------------
	insertIndicator: function(list)
	{
		let indicator = document.createElement("div");
		indicator.className = "toc-viewport";
		list.appendChild(indicator);
		return indicator;
	},
	// ----------------------------------------
	// Create metadata only if the tocList is displayed.
	// Ex: it might not be displayed at all if the window's
	// width is narrow and mediaQueries are hidding it. 
	// In that case, it would have no offsetTop. 
	// ----------------------------------------
	updateMetadata: function()
	{
		if(this._toc.clientHeight <= 0) return false;
		this._items = this.getItems();
		this._sections = this.getSections();
		return this._metadataCalculated = true;
	}
}