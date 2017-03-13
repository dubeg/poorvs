// ==================================
// Generator of Table of content
//
// Description:
// creates an ordered list from headings
// container in an element, then inserts it
// somewhere else.
// ==================================
var tocBuilder = {
	_sourceElement : null,
	_destinationElement : null,
	_headingSelectors : "h2,h3,h4,h5,h6",
	_minimumSections : 2,
	_headings : [],
	_isHooked : false,
	_ticking : false,
	_scrollY : null,
	_activeHeading : null,
	_activeClassName : null,
	_tocClass : "toc-container",
	_tocListClass : "toc-list",
	_tocListTag: "ol",

	Init : function(sourceElementID, destinationElementID, tocListClass)
	{
		this._setValue(this._tocListClass, tocListClass, "string");

		this._sourceElement = document.getElementById(sourceElementID);
		this._destinationElement = document.getElementById(destinationElementID);

		if (this._sourceElement == null || this._destinationElement == null)
			return false;
		return true;
	},
	InsertTOC : function()
	{
		var tocListElement = this.BuildTOC( this._sourceElement );
		if (tocListElement !== null)
		{
			this._destinationElement.appendChild(tocListElement);
			return true;
		}
		return false;
	},
	BuildTOC : function(headingsContainerElement)
	{
		let mainHeading = headingsContainerElement.querySelector("h1");
		let subHeadings = headingsContainerElement.querySelectorAll(this._headingSelectors);
		let heading;
		let headingNbrStr;
		let headingNbr;
		let listTag = this._tocListTag;
		let indexNbr = 0;

		if(subHeadings.length >= this._minimumSections)
		{
			let rootNode = document.createElement("div");
			let titleNode = this.BuildTOCItem(mainHeading, indexNbr, true);
			let listNode = document.createElement(listTag);

			rootNode.setAttribute("class", "toc-container");
			listNode.setAttribute("class", "toc-list");

			rootNode.appendChild(titleNode);
			rootNode.appendChild(listNode);

			let currentParent = listNode;
			let currentNode = null;
			let previousNode = null;
			let previousNbr = 2;
			indexNbr = 1;

			// Create items
			for(let i = 0; i < subHeadings.length; ++i)
			{
				heading = subHeadings[i];
				headingNbrStr = heading.nodeName;
				headingNbr = Number.parseInt(headingNbrStr[1]);
				
				if (previousNbr < headingNbr)
				{
					currentParent = document.createElement(listTag);
					previousNode.appendChild(currentParent);
				}
				else
				{	
					for(let i = headingNbr; i < previousNbr; ++i) 
						currentParent = currentParent.parentNode.parentNode;
				}
				currentNode = this.BuildTOCItem(heading, indexNbr);
				currentParent.appendChild(currentNode);
				previousNode = currentNode;
				previousNbr = headingNbr;
				indexNbr += 1;
			}
			return rootNode;
		}
		return null;
	},
	BuildTOCItem : function(heading, index, isTitle = false)
	{
		var headingID = heading.id;
		var headingLabel = heading.textContent;
		var classPrefix = "toc-";
		var className = classPrefix + heading.tagName.toLowerCase();

		var itemTag = isTitle ? "div" : "li";
		var anchorTag = "a";

		var item = document.createElement(itemTag);
		var anchor = document.createElement(anchorTag);

		anchor.setAttribute("href", "#" + headingID.toLowerCase());
		anchor.textContent = headingLabel;

		item.classList.add("toc-item");
		item.classList.add("toc-item-" + index);
		item.classList.add(className);
		item.appendChild(anchor);
		return item;
	},
	// =========================================
	_setValue: function(member, parameter, type)
	{
		if (parameter !== null && typeof parameter === type)
			member = parameter;
	}
};


