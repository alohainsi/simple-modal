// Angular
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
// Core
import { SimpleModalBroadcaster } from './__/simple-modal.broadcaster';
import { SimpleModalKeys } from './__/simple-modal.keys';
import { SimpleModalHelper } from './__/simple-modal.helper';
import { ICloseModal, IHideModal, IKeyValue, ILastModal, IModalParams, IShowModal, ISimpleModalService } from './__/simple-modal.interfaces';
import { T_DEFAULT_VALUES } from './__/simple-modal.types';
// Primer
import { LocalStorageService } from '@upr-web-primer/storage';
import { SimpleModalComponent } from './simple-modal.component';

@Injectable({
	providedIn: 'root'
})

/**
 * Export SimpleModalService
 */
export class SimpleModalService implements ISimpleModalService {
	/**
	 * Reference to the modals
	 * @type any
	 */
	private refs: IKeyValue = {};

	/**
	 * Subscriptions
	 * @type {Subscription}
	 */
	private subscriptions: Subscription;

	/**
	 * Constructor
	 * @param {SimpleModalHelper} helper
	 * @param {SimpleModalBroadcaster} broadCaster
	 * @param {LocalStorageService} localStorage
	 */
	constructor(private helper: SimpleModalHelper,
							private broadCaster: SimpleModalBroadcaster,
							private localStorage: LocalStorageService) {
	}

	/**
	 * Show the modal
	 * 			=> sm.show(false|true) - gonna close all modals
	 * 			=> sm.show('ComponentNameId') - gonna show a modal with id "ComponentNameId"
	 * 			=> sm.show() - gonna show the last opened modal
	 * @param {string|boolean} id
	 */
	show(id?: string | boolean): void {
		if (id) {
			if (typeof id === 'string') {
				this.setLastId(id);
			}
		} else {
			id = this.getLastId();
		}

		this.hide(T_DEFAULT_VALUES.ALL_OF_THEM);

		const data: IShowModal = {
			id: (!id || typeof id === 'boolean' ? T_DEFAULT_VALUES.ALL_OF_THEM : id)
		};
		this.broadCaster.emit(SimpleModalKeys.SHOW_MODAL, data);
	}

	/**
	 * Hide the modal
	 * 			=> sm.hide(false|true) - gonna hide all existing modals
	 * 			=> sm.hide('ComponentNameId')	- gonna hide a modal with id "ComponentNameId"
	 * 			=> sm.hide() - gonna hide the last opened modal
	 * @param {string|boolean} id
	 */
	hide(id?: string | boolean): void {
		if (id) {
			if (typeof id === 'string') {
				this.setLastId(id);
			}
		} else {
			id = this.getLastId();
		}
		const data: IHideModal = {
			exceptId: (!id || typeof id === 'boolean' ? T_DEFAULT_VALUES.ALL_OF_THEM : id)
		};
		this.broadCaster.emit(SimpleModalKeys.HIDE_MODAL, data);
	}

	/**
	 * Close the modal
	 * 			=> sm.close(false|true) - gonna close all existing modals
	 * 			=> sm.close('ComponentNameId') - gonna close a modal with id "ComponentNameId"
	 * @param {string} id
	 */
	close(id?: string | boolean): void {
		if (!id || typeof id !== 'boolean') {
			id = this.getLastId();
		}
		this.destroyModal({
			id: (!id || typeof id === 'boolean' ? T_DEFAULT_VALUES.ALL_OF_THEM : id)
		});
	}

	/**
	 * Open modal
	 * 			=> sm.open('ComponentNameId', data, options) - gonna open a new modal with a "ComponentNameId" in inside (component name is a string)
	 * 			=> sm.open(Component, data, options) - gonna open a new modal with a "Component" in inside (component is an instance)
	 * 			=> sm.open(Component, data, {
	 * 						position: T_MODAL_POSITION.TOP // the modal position would be in a top of a page
	 * 						// If a position different then center, it would be good to specify dimensions for the device types,
	 * 								otherwise SimpleModal gonna use default values from config itself
	 * 					  dimensions: {
	 * 					    	mobile: {height: 30}, // Modal width for the mobile devices
										tablet: {height: 25}, // Modal width for the tablet devices
										desktop: {width: 100, height: 20}, // Modal width for the desktop devices
										isPercent: true // Default value. Gonna calculate dimensions in percent, otherwise in pixel
	 * 					  },
	 * 					  isShade: true // gonna display the shade for the modal
	 * 				})
	 * @param {any} component
	 * @param {any} data
	 * @param {IModalParams} params
	 * @return {string}
	 */
	open(component: any, data: object, params?: IModalParams): string {
		if (this.helper.sizeOf(this.refs) < 1) {
			this.localStorage.setItem(SimpleModalKeys.LAST_ID, null);
			this.subscriptions = (new Subscription());
			this.subscriptions.add(
				this.broadCaster.on<ICloseModal>(SimpleModalKeys.CLOSE_MODAL).subscribe((_val: ICloseModal): void => {
					this.destroyModal(_val);
				})
			);
		}
		return this.createModal(component, data, params);
	}

	/**
	 * Set last used id
	 * @param {string} id
	 * @param {boolean} exclude
	 */
	private setLastId(id: string, exclude = false): ILastModal {
		const obj: IKeyValue = {};
		let cacheData = this.localStorage.getItem(SimpleModalKeys.LAST_ID);
		if (cacheData) {
			cacheData = JSON.parse(cacheData);
		}
		if (cacheData) {
			for (const x in cacheData) {
				if (cacheData.hasOwnProperty(x) && x !== id) {
					obj[x] = x;
				}
			}
		}
		if (!exclude) {
			obj[id] = id;
		}
		if (this.helper.sizeOf(obj) > 0) {
			this.localStorage.setItem(SimpleModalKeys.LAST_ID, obj);
		}

		return {id: id};
	}

	/**
	 * Get last used modal ID
	 * @return {string}
	 */
	private getLastId(): string {
		let id;
		let cacheData = this.localStorage.getItem(SimpleModalKeys.LAST_ID);
		if (cacheData) {
			cacheData = JSON.parse(cacheData);
		}
		if (cacheData) {
			const keys = Object.keys(cacheData);
			if (keys) {
				id = keys[keys.length - 1];
			}
		}
		return id ? id : '';
	}

	/**
	 * Create a new <simple-modal> component in a DOM
	 */
	private createModal(component: any, data: object, params?: IModalParams): string {

		// Get modalId
		const modalData = this.setLastId(this.helper.getId(component));

		// Define modal properties
		const serviceData: IModalParams = {
			modalId: modalData.id,
			execute: {
				component: component,
				data: data
			}
		};

		// Create and render component
		this.refs[modalData.id] = this.helper.createComponent(
			SimpleModalComponent,
			this.helper.merge(serviceData, params)
		);

		// Return new generated ID
		return modalData.id;
	}

	/**
	 * Destroy modal
	 * @param {ICloseModal} data
	 */
	private destroyModal(data: ICloseModal): void {

		// If we need to destroy all modals
		if (data.id === T_DEFAULT_VALUES.ALL_OF_THEM) {

			// Destroy all existing modals
			for (const x in this.refs) {
				if (this.refs.hasOwnProperty(x)) {
					this.refs[x].destroy();
					this.setLastId(data.id, true);
				}
			}

			// Need to destroy just specific modal
		} else {
			this.refs[data.id].destroy();
			this.setLastId(data.id, true);
		}

		// If we don't have any other existing modals -> unsubscribe from subscriptions
		if (this.helper.sizeOf(this.refs) < 1) {
			this.subscriptions.unsubscribe();

			// Reset last z-index if we got no other modals
			this.localStorage.setItem(SimpleModalKeys.LAST_Z_INDEX, 0);
		}
	}

}
