// 1. Iterate through all sections in post.
// 2. Get top and bottom position foreach section.
var tocViewport = {

	_isTicking : false,
	_isHooked : false,
	_sections : null,
	_lists : null,
	_indicators : null,
	_items : null,

	Init: function()
	{
		this._lists = document.getElementsByClassName("toc-list");
		if (this._lists.length < 1)
			return false;
		this.insertIndicators(this._lists);
		this._items = this.getItems(this._lists[0]);
        this._sections = this.getSections();
		this.onTick();
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
		let sectionsInViewport = this.updateSectionsInViewport(this._sections);
		this.updateViewportIndicator(sectionsInViewport);
		// --------------------
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
				sections.push({ 
					sectionName: sectionName, 
					top: top, 
					bottom: bottom, 
					index: index
				});
			}
		}
		return sections;
    },
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
	// =================================================
	updateSectionsInViewport: function(sections)
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
			//this.setItemClass(section, isInView);
		}
		return sectionsInViewport;
	},
	setItemClass: function(section, isInView)
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
	// =================================================
	updateViewportIndicator: function(sectionsInViewport)
	{
		let items = this._items;
		let list = this._lists[0];
		let indicators = document.getElementsByClassName("toc-viewport");

		// Get infos
		// ----------
		let firstItem = items[sectionsInViewport[0].index];
		let lastItem = items[sectionsInViewport[sectionsInViewport.length - 1].index];
		
		let top = firstItem.top;
		let height = lastItem.top + lastItem.height - top;

		// Update indicators
		// -----------------
		for(let i = 0; i < indicators.length; ++i)
		{
			let indicator = indicators[i];
			indicator.style.height = height + "px";
			indicator.style.top = top + "px";
		}
	},
	// =================================================
	insertIndicators: function(lists)
	{
		let indicator = document.createElement("div");
		indicator.className = "toc-viewport";

		for( let i = 0; i < lists.length; ++i)
		{
			let list = lists[i];
			let indicatorClone = indicator.cloneNode(true);
			list.appendChild(indicatorClone);
		}
	},
	// =================================================
	getItems: function(list)
	{
		let itemInfos = [];
		let items = list.getElementsByTagName("li");

		for(let i = 0; i < items.length; ++i)
		{
			let item = items[i];
			let styles = window.getComputedStyle(item, null);
			let lineHeight = styles.getPropertyValue("line-height");

			let top = item.offsetTop;
			let height = Number.parseInt(lineHeight.slice(0, -2));

			itemInfos.push({
				class: item.className,
				height: height,
				top: top
			});
			// console.log(top);
		}
		return itemInfos;
	}
}