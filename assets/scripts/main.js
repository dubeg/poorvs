// =====================================================
//   Main
// =====================================================
function mainInit()
{

	var elemtOutline;
	var elemtOutlineList;
	var elemtTrail = document.getElementById("site-trail-placeholder");


	// Trail
	// -----------------------
	var location = window.location;
	var uriOrigin = location.origin;
	var uriPath = location.pathname;
	var classOnInsert = "visible";

	//trailUtil.Init(uriOrigin, uriPath, elemtTrail, classOnInsert);
	//trailUtil.UpdateUI();


	// Page Number
	// -----------------------
	if(pageNbrUtil.Init())
		pageNbrUtil.UpdateLabel();


	// Outline 
	// -----------------------
	let headingsContainerElementId = "post";
	let tocContainerElementId = "toc";
	let postNavElementId = "post-nav";
	let headingSelectors = "h1,h2,h3,h4,h5,h6";
	let tocListId = "toc-list";
	let tocVisibleClassName = "visible";

	if (tocBuilder.Init(headingsContainerElementId, tocContainerElementId, headingSelectors, tocListId))
	{
		if(tocBuilder.InsertTOC()) {
			// set toc visible
			// set nav toc-visible to fix its margin if toc isnt displayed.
			document.getElementById(postNavElementId).classList.add(tocVisibleClassName);
			document.getElementById(tocContainerElementId).classList.add(tocVisibleClassName);

			if (tocScroll.Init(tocListId))
				tocScroll.Start();

			if (tocViewport.Init())
				tocViewport.Start();
		}
	}
}

// DOMContentLoaded fires once HTML is loaded.
//document.addEventListener('DOMContentLoaded', mainInit);
//document.addEventListener('DOMContentLoaded', initTOC);

// Window.load fires when DOM, CSSOM, images are loaded.
window.addEventListener('load', mainInit);