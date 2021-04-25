class ImageViewer {
	
	constructor(className) {
		if(!className) return;
		ImageViewer.className = className;
		ImageViewer.setEventsOnImages();
		ImageViewer.initApp();
	}
	
	static initApp() {
		
		let app = ImageViewer.createElement({tag: 'div', className: 'siv-app'});
		let next = ImageViewer.createElement({tag: 'div', className: 'siv-next', innerHTML: '&#10095', eventParams: {eventType: 'click', listener: ImageViewer.showNextImage}});
		let previous = ImageViewer.createElement({tag: 'div', className: 'siv-previous', innerHTML: '&#10094', eventParams: {eventType: 'click', listener: ImageViewer.showPreviousImage}});
		let background = ImageViewer.createElement({tag: 'div', className: 'siv-background', eventParams: {eventType: 'click', listener: ImageViewer.hideImage}});
		ImageViewer.container = ImageViewer.createElement({tag: 'div', className: 'siv-display-none'});
		ImageViewer.img = ImageViewer.createElement({tag: 'img'});
		
		background.append(ImageViewer.img);
		ImageViewer.container.append(...[background, previous, next]);
		app.attachShadow({mode: 'open'});
		app.shadowRoot.append(...[ImageViewer.getCssStyles(), ImageViewer.container]);
		
		document.body.append(app);
		document.addEventListener('keydown', ImageViewer.buttonsControl);
	}
	
	static createElement(properties) {
		let el = document.createElement(properties.tag);
		
		if(properties.hasOwnProperty('className')) ImageViewer.addClass(el, properties.className);
		if(properties.hasOwnProperty('innerHTML')) el.innerHTML = properties.innerHTML;
		if(properties.hasOwnProperty('eventParams')) el.addEventListener(properties.eventParams.eventType, properties.eventParams.listener);
		
		return el;
	}
	
	static setEventsOnImages() {
		let imgs = ImageViewer.getImages();
		
		if(!imgs) return;
		
		for(let img of imgs) img.addEventListener('click',  ImageViewer.showZoomedImage);
	}
	
	static addClass(el, className) {
		el.classList.add(className);
	}
	
	static removeClass(el, className) {
		el.classList.remove(className);
	}
	
	static showZoomedImage() {
		ImageViewer.img.src = event.target.src;
		ImageViewer.img.dataset.no = ImageViewer.getIndexOfImage(event.target);
		document.body.style.overflow = 'hidden';
		ImageViewer.removeClass(ImageViewer.container, 'siv-display-none');
	}
	
	static getImages() {
		return document.querySelectorAll('.' + ImageViewer.className);
	}
	
	static getIndexOfImage(img) {
		return Array.prototype.indexOf.call(ImageViewer.getImages(), img);;
	}
	
	static showPreviousImage() {
		let imgs = ImageViewer.getImages();
		if(ImageViewer.img.dataset.no != 0) ImageViewer.img.src = imgs[--ImageViewer.img.dataset.no].src;
		else ImageViewer.img.src = imgs[ImageViewer.img.dataset.no = imgs.length - 1].src;
	}
	
	static showNextImage() {
		let imgs = ImageViewer.getImages();
		if(ImageViewer.img.dataset.no < imgs.length - 1) ImageViewer.img.src = imgs[++ImageViewer.img.dataset.no].src;
		else ImageViewer.img.src = imgs[ImageViewer.img.dataset.no = 0].src;
	}
	
	static hideImage() {
		ImageViewer.addClass(ImageViewer.container, 'siv-display-none');
		document.body.style.overflow = 'auto';
	}
	
	static isImageViewerClosed() {
		return ImageViewer.container.className === 'siv-display-none';
	}
	
	static buttonsControl() {
		if(ImageViewer.isImageViewerClosed()) return;
		
		switch (event.keyCode) {
			case 37:
				ImageViewer.showPreviousImage();
				break;
			case 39:
				ImageViewer.showNextImage();
				break;
			case 27:
				ImageViewer.hideImage();
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