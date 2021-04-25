class simpleImageViewer {
	
	constructor(className) {
		if(!className) return;
		simpleImageViewer.className = className;
		simpleImageViewer.setEventsOnImages();
		simpleImageViewer.initApp();
	}
	
	static initApp() {
		
		let app = simpleImageViewer.createElement({tag: 'div', className: 'siv-app'});
		let next = simpleImageViewer.createElement({tag: 'div', className: 'siv-next', innerHTML: '&#10095', eventParams: {eventType: 'click', listener: simpleImageViewer.showNextImage}});
		let previous = simpleImageViewer.createElement({tag: 'div', className: 'siv-previous', innerHTML: '&#10094', eventParams: {eventType: 'click', listener: simpleImageViewer.showPreviousImage}});
		let background = simpleImageViewer.createElement({tag: 'div', className: 'siv-background', eventParams: {eventType: 'click', listener: simpleImageViewer.hideImage}});
		simpleImageViewer.container = simpleImageViewer.createElement({tag: 'div', className: 'siv-display-none'});
		simpleImageViewer.img = simpleImageViewer.createElement({tag: 'img'});
		
		background.append(simpleImageViewer.img);
		simpleImageViewer.container.append(...[background, previous, next]);
		app.attachShadow({mode: 'open'});
		app.shadowRoot.append(...[simpleImageViewer.getCssStyles(), simpleImageViewer.container]);
		
		document.body.append(app);
		document.addEventListener('keydown', simpleImageViewer.buttonsControl);
	}
	
	static createElement(properties) {
		let el = document.createElement(properties.tag);
		
		if(properties.hasOwnProperty('className')) simpleImageViewer.addClass(el, properties.className);
		if(properties.hasOwnProperty('innerHTML')) el.innerHTML = properties.innerHTML;
		if(properties.hasOwnProperty('eventParams')) el.addEventListener(properties.eventParams.eventType, properties.eventParams.listener);
		
		return el;
	}
	
	static setEventsOnImages() {
		let imgs = simpleImageViewer.getImages();
		
		if(!imgs) return;
		
		for(let img of imgs) img.addEventListener('click',  simpleImageViewer.showZoomedImage);
	}
	
	static addClass(el, className) {
		el.classList.add(className);
	}
	
	static removeClass(el, className) {
		el.classList.remove(className);
	}
	
	static showZoomedImage() {
		simpleImageViewer.img.src = event.target.src;
		simpleImageViewer.img.dataset.no = simpleImageViewer.getIndexOfImage(event.target);
		document.body.style.overflow = 'hidden';
		simpleImageViewer.removeClass(simpleImageViewer.container, 'siv-display-none');
	}
	
	static getImages() {
		return document.querySelectorAll('.' + simpleImageViewer.className);
	}
	
	static getIndexOfImage(img) {
		return Array.prototype.indexOf.call(simpleImageViewer.getImages(), img);;
	}
	
	static showPreviousImage() {
		let imgs = simpleImageViewer.getImages();
		if(simpleImageViewer.img.dataset.no != 0) simpleImageViewer.img.src = imgs[--simpleImageViewer.img.dataset.no].src;
		else simpleImageViewer.img.src = imgs[simpleImageViewer.img.dataset.no = imgs.length - 1].src;
	}
	
	static showNextImage() {
		let imgs = simpleImageViewer.getImages();
		if(simpleImageViewer.img.dataset.no < imgs.length - 1) simpleImageViewer.img.src = imgs[++simpleImageViewer.img.dataset.no].src;
		else simpleImageViewer.img.src = imgs[simpleImageViewer.img.dataset.no = 0].src;
	}
	
	static hideImage() {
		simpleImageViewer.addClass(simpleImageViewer.container, 'siv-display-none');
		document.body.style.overflow = 'auto';
	}
	
	static issimpleImageViewerClosed() {
		return simpleImageViewer.container.className === 'siv-display-none';
	}
	
	static buttonsControl() {
		if(simpleImageViewer.issimpleImageViewerClosed()) return;
		
		switch (event.keyCode) {
			case 37:
				simpleImageViewer.showPreviousImage();
				break;
			case 39:
				simpleImageViewer.showNextImage();
				break;
			case 27:
				simpleImageViewer.hideImage();
				break;
		}
	}	
	
	static getCssStyles() {		
		let styles = document.createElement('style');
		
		styles.append(
			document.createTextNode(
				`
				.siv-background {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					min-height: 100%;
					background: rgba(0, 0, 0, 0.5);
					overflow: auto;
				}
				.siv-display-none {
					display: none;
				}
				.siv-background img {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 70%;
				}
				.siv-previous, .siv-next {
					position: fixed;
					display: flex;
					width: 10%;
					height: 100%;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					color: white;
					user-select: none;
				}
				.siv-previous:hover, .siv-next:hover {
					color: #D3D3D3;
				}
				.siv-next {
					top: 0;
					right: 0;
				}
				.siv-previous {
					top: 0;
					left: 0;
				}
				`
			)
		);
		
		return styles;
	}
}