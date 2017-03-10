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
	_headingSelectors : "h1,h2,h3,h4,h5,h6",
	_minHeadersToShow : 3,
	_headings : [],
	_isHooked : false,
	_ticking : false,
	_scrollY : null,
	_activeHeading : null,
	_activeClassName : null,
	_tocListClass : "toc-list",
	_tocListTag: "ol",

	Init : function(sourceElementID, destinationElementID, headingSelectors, tocListClass)
	{
		this._setValue(this._headingSelectors, headingSelectors, "string");
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
		// NodeList
		let headingNodes = headingsContainerElement.querySelectorAll(this._headingSelectors);
		let headingNode;
		let headingNbrStr;
		let headingNbr;
		if(headingNodes.length >= this._minHeadersToShow)
		{
			// Create list
			let listTagName = this._tocListTag;
			let rootNode = document.createElement(listTagName);
			rootNode.setAttribute("class", this._tocListClass);
			// Init 
			let currentParent = rootNode;
			let currentNode = null;
			let previousNode = null;
			let previousNbr = 1;
			// Create items
			for(let i = 0; i < headingNodes.length; ++i)
			{
				headingNode = headingNodes[i];
				headingNbrStr = headingNode.nodeName;
				headingNbr = Number.parseInt(headingNbrStr[1]);
				
				if (previousNbr < headingNbr)
				{
					currentParent = document.createElement(listTagName);
					previousNode.appendChild(currentParent);
				}
				else
				{	
					for(let i = headingNbr; i < previousNbr; ++i) 
						currentParent = currentParent.parentNode.parentNode;
				}
				currentNode = this.BuildTOCItem(headingNode, i);
				currentParent.appendChild(currentNode);
				previousNode = currentNode;
				previousNbr = headingNbr;
			}
			return rootNode;
		}
		return null;
	},
	BuildTOCItem : function(heading, index)
	{
		var headingID = heading.id;
		var headingLabel = heading.textContent;
		var classPrefix = "toc-";
		var className = classPrefix + heading.tagName.toLowerCase();

		var itemTag = "li";
		var anchorTag = "a";

		var item = document.createElement(itemTag);
		var anchor = document.createElement(anchorTag);

		anchor.setAttribute("href", "#" + headingID.toLowerCase());
		anchor.textContent = headingLabel;

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


