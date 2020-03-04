// Angular
import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, HostListener, Inject, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
// Core
import { SimpleModalBroadcaster } from './__/simple-modal.broadcaster';
import { SimpleModalKeys } from './__/simple-modal.keys';
import { SimpleModalHelper } from './__/simple-modal.helper';
import { IChildCss, ICloseModal, IComponentExecute, IDeviceDimensions, IHideModal, IKeyValue, IParentCss, IShowModal } from './__/simple-modal.interfaces';
import { T_DEFAULT_VALUES, T_DEVICE_TYPE, T_MODAL_POSITION } from './__/simple-modal.types';
// Other
import { WINDOW } from '@upr-web-primer/window';
import { LocalStorageService } from '@upr-web-primer/storage';
import { LockScrollService } from '@upr-web-primer/lock-scroll';

@Component({
	selector: 'upr-simple-modal',
	templateUrl: './simple-modal.component.html',
	styleUrls: ['./simple-modal.component.scss']
})

/**
 * Export class SimpleModalComponent
 */
export class SimpleModalComponent implements AfterViewInit, OnDestroy {
	/**
	 * Setup custom viewChild for the container div
	 * We gonna create <simple-modal> dynamically
	 */
	@ViewChild('container', {read: ViewContainerRef, static: false})
	container: ViewContainerRef;

	/**
	 * Flag: Current modal status hide|show
	 * @type {boolean}
	 */
	isHidden = false;

	/**
	 * Overlay with a shade
	 * @type {boolean}
	 */
	isShade = true;

	/**
	 * Dimensions
	 * @type IDeviceDimensions
	 */
	dimensions: IDeviceDimensions;

	/**
	 * Component references
	 * @type ComponentRef
	 */
	refs: ComponentRef<any>;

	/**
	 * Modal ID
	 * @type string
	 */
	modalId: string;

	/**
	 * Parent css properties
	 * @type IParentCss
	 */
	parentCss: IParentCss;

	/**
	 * Child css properties
	 * @type IChildCss
	 */
	childCss: IChildCss;

	/**
	 * Position
	 * @type T_MODAL_POSITION
	 */
	private position: T_MODAL_POSITION = T_MODAL_POSITION.CENTER;

	/**
	 * Component params
	 * @type {}
	 */
	private execute: IComponentExecute;

	/**
	 * Subscriptions
	 * @type {Subscription}
	 */
	private subscriptions = (new Subscription());

	/**
	 * Window DOM object
	 * @type Window
	 */
	private _window: Window;

	/**
	 * Timer
	 * @type any
	 */
	private timer: any;

	/**
	 * Simple modal config data
	 * @type {any}
	 */
	readonly config: IKeyValue = {
		// Point to detect device type by screen width (MAX value)
		resolution: {
			mobile: 640, // Mobile (mav value in px)
			tablet: 970 // Tablet (mav value in px)
		},
		/**
		 * Default values if we did't received needed data
		 */
		defValues: {
			mobile: {
				width: 80,
				height: 20
			},
			tablet: {
				width: 50,
				height: 15
			},
			desktop: {
				width: 30,
				height: 10
			},
			// Center position
			center: {
				width: 80,
				height: 80
			},
			isPercent: true // Use a percent to calculate dimensions
		}
	};

	/**
	 * Constructor
	 * @param {SimpleModalBroadcaster} broadCaster
	 * @param {SimpleModalHelper} helper
	 * @param {ChangeDetectorRef} changeDetector
	 * @param {LocalStorageService} localStorage
	 * @param {LockScrollService} scrollService
	 * @param {any} window
	 */
	constructor(private broadCaster: SimpleModalBroadcaster,
							private helper: SimpleModalHelper,
							private changeDetector: ChangeDetectorRef,
							private localStorage: LocalStorageService,
							private scrollService: LockScrollService,
							@Inject(WINDOW) private window: any) {
		this._window = this.window as Window;
	}

	// Start listen keypress
	@HostListener('document:keyup', ['$event'])
	keyup(event: KeyboardEvent): void {
		// I did replace "keyCode", cause it's deprecated now
		if ((this.helper.dispatchForCode(event) + '').toLowerCase() === 'escape') {
			const data: ICloseModal = {
				id: this.modalId
			};
			this.broadCaster.emit(SimpleModalKeys.CLOSE_MODAL, data);
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(): void {
		clearInterval(this.timer);
		this.timer = setTimeout(() => {
			this.initData();
		}, 50);
	}

	/**
	 * ngOnInitJ
	 */
	ngAfterViewInit(): void {

		// Lock screen
		this.scrollService.lockScroll();

		// Create and render component
		this.refs = this.helper.createComponent(
			this.execute.component,
			this.execute.data,
			this.container
		);

		// Initialize subscriptions
		this.initSubscriptions();

		// Initialize needed data
		this.initData();
	}

	/**
	 * Initialize needed data
	 */
	private initData(): void {
		// Define position object
		const lastZIndex = this.localStorage.getItem(SimpleModalKeys.LAST_Z_INDEX) || 0;
		this.parentCss = {
			zIndex: 1000 + parseInt(lastZIndex, 10) + 1
		};
		this.childCss = {};

		// Keep in localstorage last zIndex
		this.localStorage.setItem(SimpleModalKeys.LAST_Z_INDEX, lastZIndex);

		// Define screen width
		const screenWidth: number = this._window.innerWidth;

		// Define screen height
		const screenHeight: number = this._window.innerHeight;

		// Get pixel value for the width and height
		const getPxValue = (org: number, value: number): number => {
			return (org * value / 100);
		};

		// Define needed variables
		let deviceType: string;
		const cssObj: any = {};

		// Define device type
		if (this.position === T_MODAL_POSITION.CENTER) {
			deviceType = T_DEVICE_TYPE.CENTER;
		} else {
			deviceType = screenWidth <= this.config.resolution.mobile
				? T_DEVICE_TYPE.MOBILE
				: (screenWidth <= this.config.resolution.tablet ? T_DEVICE_TYPE.TABLET : T_DEVICE_TYPE.DESKTOP);
		}

		// Get dimension value for the width or height
		const getDimensionValue = (fieldName: string, justObj = false): number => {
			if (justObj) {
				return this.dimensions && this.dimensions[deviceType] ? this.dimensions[deviceType] : undefined;
			}
			const obj = this.dimensions && this.dimensions[deviceType] ? this.dimensions[deviceType] : this.config.defValues[deviceType];
			return obj ? obj[fieldName] : undefined;
		};

		if (this.position === T_MODAL_POSITION.CENTER) {
			cssObj.width = getPxValue(screenWidth, getDimensionValue('width'));
			cssObj.height = getPxValue(screenHeight, getDimensionValue('height'));
		} else {
			if (this.position === T_MODAL_POSITION.RIGHT || this.position === T_MODAL_POSITION.LEFT) {
				cssObj.height = screenHeight;
				cssObj.width = getPxValue(screenWidth, getDimensionValue('width'));
			}
			if (this.position === T_MODAL_POSITION.TOP || this.position === T_MODAL_POSITION.BOTTOM) {
				cssObj.width = screenWidth;
				cssObj.height = getPxValue(screenHeight, getDimensionValue('height'));
			}
		}

		if (this.position === T_MODAL_POSITION.CENTER) {
			cssObj.top = getPxValue(screenHeight, ((100 - getDimensionValue('height')) / 2));
			cssObj.left = getPxValue(screenWidth, ((100 - getDimensionValue('width')) / 2));
		}

		if (this.position === T_MODAL_POSITION.RIGHT || this.position === T_MODAL_POSITION.LEFT) {
			cssObj[this.position === T_MODAL_POSITION.RIGHT ? 'right' : 'left'] = 0;
		}

		if (this.position === T_MODAL_POSITION.BOTTOM || this.position === T_MODAL_POSITION.TOP) {
			cssObj[this.position === T_MODAL_POSITION.BOTTOM ? 'bottom' : 'top'] = 0;
		}

		// Loop needed styles to apply it to the "modal-content"
		['width', 'height', 'top', 'left', 'right', 'bottom', 'z-index'].forEach((field: string) => {
			if (cssObj.hasOwnProperty(field)) {
				if (field === 'z-index') {
					this.parentCss.zIndex = cssObj[field];
				} else {
					// Apply css styles
					this.childCss[field] = `${cssObj[field]}${(this.dimensions && this.dimensions.isPercent) || (this.dimensions && typeof this.dimensions.isPercent === 'undefined')
						? typeof cssObj[field] === 'number' && cssObj[field] > 0 ? '%' : ''
						: 'px'}`;
				}
			}
		});

		// Detect new changes in entire component
		this.changeDetector.detectChanges();
	}

	/**
	 * Initialize Subscriptions
	 */
	private initSubscriptions(): void {
		// If we need to hide modal
		this.subscriptions.add(
			this.broadCaster.on<IHideModal>(SimpleModalKeys.HIDE_MODAL).subscribe((val: IHideModal) => {
				if (val.exceptId === T_DEFAULT_VALUES.ALL_OF_THEM) {
					this.isHidden = true;
				} else {
					if (this.modalId !== val.exceptId) {
						this.isHidden = true;
					}
				}
			})
		);

		// If we need to show modal
		this.subscriptions.add(
			this.broadCaster.on<IShowModal>(SimpleModalKeys.SHOW_MODAL).subscribe((val: IShowModal) => {
				if (val.id === T_DEFAULT_VALUES.ALL_OF_THEM) {
					this.isHidden = false;
				} else {
					if (this.modalId !== val.id) {
						this.isHidden = false;
					}
				}
			})
		);
	}

	/**
	 * ngOnDesytroy
	 */
	ngOnDestroy(): void {
		this.scrollService.unlockScroll();
		this.subscriptions.unsubscribe();
	}

}
