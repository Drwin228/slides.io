function showError(el, err) {
	el.innerText = `${err} - (Original innerText=${el.innerText})`
}

function showCode(el, language, code, link) {
	var newEl = document.createElement('pre');
	newEl.setAttribute('class', `language-${language}`);
	//Replace special chars
	code = code.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;")


	let codeEl = document.createElement('code')
	codeEl.innerHTML = code
	newEl.appendChild(codeEl)

	el.parentNode.replaceChild(newEl, el);
	RevealHighlight().hljs.highlightBlock(newEl)

	if (link) {
		let linkNode = document.createElement("div");
		linkNode.classList.add("source-code-link")
		linkNode.innerHTML = `<a href = "${link}" > ${link}</a >`
		newEl.parentNode.insertBefore(linkNode, newEl.nextSibling);
	}
}

function extractBeginEndSnippet(code, beginMarker, endMarker) {
	let lines = code.split('\n');
	let out = "";
	let beginFound = beginMarker ? false : true

	for (let line of lines) {
		if (line === beginMarker) {
			beginFound = true;
			continue;
		} else if (line === endMarker) {
			break;
		} else if (!beginFound) {
			continue;
		}

		out += line + "\n";
	}

	return out.trim();
}

export default () => {

	return {
		id: 'show_code_snippets',
		init: (deck) => {

			deck.on('ready', () => {
				for (let el of deck.getRevealElement().querySelectorAll("a[data-code]")) {
					//console.log(`Loading code snippets, looking at`, el)
					let language = el.getAttribute("data-code");
					let url = el.getAttribute("href");
					let beginMarker = el.getAttribute("data-begin")
					let endMarker = el.getAttribute("data-end")
					let showLink = el.hasAttribute("data-link")

					//console.log(`language = ${ language }, url = ${ url }, beginMarker = ${ beginMarker }, endMarker = ${ endMarker }, showLink = ${ showLink } `)

					if (url) {
						fetch(url).then(response => response.text()).then(text => {
							let code = extractBeginEndSnippet(text, beginMarker, endMarker)
							showCode(el, language, code, showLink ? url : null)
						}).catch(err => {
							showError(el, err)
						})
					} else {
						showError(el, "No URL provided in elements innerText")
					}
				}


			})

		}
	}
}