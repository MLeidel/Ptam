/*
ptam.js
Programming Textarea Mobile
This is a "subset" of the "Pta" library.
(C) Michael D Leidel, 2016
All Rights Reserved.
If you use this library it 
must display this comment block.
-------------------------------
After the library is loaded..
activate with: Ptam.initialize(textarea id);
*/

var Ptam = {

initialize: function(sid) {
	var Oid = document.getElementById(sid);		// get the textarea ID
	Ptam.setTabs(Oid);
	Oid.style.tabSize = 3;
	Oid.style.MozTabSize = 3;
	Ptam.setIndent(Oid);
},

/*
 tabs
*/
	///
 ///	tabs and selection tabs
///
setTabs: function(TAo) {

	TAo.addEventListener("keydown", function(event) {
		if ( event.keyCode == 9 && !event.shiftKey ) {
			event.preventDefault();
			var p1, p2, txt, sels, sele;
			sels = this.selectionStart;
			sele = this.selectionEnd;
			txt	= this.value;
			if (sels == sele) {	// a regular tab
				this.value = txt.slice(0, sels)+'\t'+txt.slice(sele);
				this.selectionStart=this.selectionEnd=sels+1;
				return;
			}
			// selection tab
			var stxt = txt.slice(sels,sele);
			var nl = countNewLines(stxt);

			if (txt.charCodeAt(sele - 1) != 10)	{ // won't do tabs unless whole lines are selected
				var i1, i2;
				var len	= stxt.length;
				while (1) {					// find the selection
					var si = this.selectionEnd;
					i1 = txt.indexOf(stxt, si);
					i2 = i1 + len;
					if (i1 >= 0) {
						this.selectionStart = i1;
						this.selectionEnd = i2;
					} else {
						if (si > 0) {
							this.selectionStart = 0;
							this.selectionEnd = 0;
							continue;
						}
					}
					return;
				}
			}

			stxt = stxt.replace(/\s+$/g, '');	// trim right
			stxt = stxt.replace( new RegExp( '\n', 'g' ), '\n\t' );
			p1 = txt.slice(0,sels);
			p2 = txt.slice(sele);
			this.value = p1 + '\t' + stxt + '\n' + p2;
			this.selectionStart = sels;
			this.selectionEnd = sele + nl;
			return;
		}

		function countNewLines(txt) {
			var inx, c=0;
			for (inx=0; inx < txt.length; inx++) {
				if (txt.charAt(inx) == '\n') c++;
			}
			return c;
		}
	});

	///
 ///	back-tabs and selection back-tabs
///

	TAo.addEventListener("keydown", function(event) {
		if ( event.keyCode == 9 && event.shiftKey ) {
			event.preventDefault();
			var p1, p2, txt, sels, sele;
			sels = this.selectionStart;
			sele = this.selectionEnd;
			txt	= this.value;
			if (sels == sele) {	// regular backTab
				p1 = txt.slice(0,sels-1);
				p2 = txt.slice(sels);
				this.value = p1 + p2;
				this.selectionStart = sels-1;
				this.selectionEnd = sels-1;
				return;
			}
			// selection backTab
			var stxt= txt.slice(sels,sele);
			var nl = countNewLines(stxt);
			if (stxt.charCodeAt(0) > 32) return;
			stxt = stxt.replace( new RegExp( '\n\t', 'g' ), '\n' );
			p1 = txt.slice(0,sels);
			p2 = txt.slice(sele);
			this.value = p1 + stxt.slice(1) + p2;
			this.selectionStart = sels;
			this.selectionEnd = sele - nl;
			return;
		}
		function countNewLines(txt) {
			var inx, c=0;
			for (inx=0; inx < txt.length; inx++) {
				if (txt.charAt(inx) == '\n') c++;
			}
			return c;
		}
	});
},

/*
 Auto Indent
*/

setIndent: function(TAo) {

	TAo.addEventListener("keydown", function(event) {
			if ( event.keyCode == 13 && !event.ctrlKey ) {

			event.preventDefault();
			var inx, stx, chx, v=this.value, s=this.selectionStart, e=this.selectionEnd;

			for (inx=s-1; inx > 0; inx--) {
				if (v.charCodeAt(inx) == 10) break;
			}
			stx = String.fromCharCode(10);		// put a 10 in the string

			if (inx > 0)
				inx++;	// inc past the 10

			chx = v.charCodeAt(inx);

			while (chx == 32 || chx == 9) {
				stx += String.fromCharCode(chx);
				inx++;
				chx = v.charCodeAt(inx);
			}
			this.value=v.slice(0, s) + stx + v.slice(e);
			this.selectionStart=this.selectionEnd=s+stx.length;
			return;
			}
		});

}	// end setIndent

};
