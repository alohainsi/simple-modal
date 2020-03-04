// Angular
import { ComponentRef } from '@angular/core';
// Core
import { T_MODAL_POSITION } from './simple-modal.types';

export interface IBroadCaster {
	key: any;
	data?: any;
}

export interface IModalParams {
	[key: string]: any;

	execute?: IComponentExecute;
	modalId?: string;
	position?: T_MODAL_POSITION;
	isShade?: boolean;
	isHidden?: boolean;
	dimensions?: IDeviceDimensions;
}

export interface IComponentExecute {
	component: any;
	data?: {
		[key: string]: any;
	};
}

export interface IDeviceDimensions {
	mobile?: IDimension;
	tablet?: IDimension;
	desktop?: IDimension;
	center?: IDimension;
	isPercent?: boolean;
	[key: string]: any;
}

export interface IDimension {
	width?: number;
	height?: number;
	[key: string]: any;
}

export interface ISimpleHelper {
	dispatchForCode(event: any): string | number;

	createComponent(component: any, data?: IKeyValue): ComponentRef<any>;

	sizeOf(obj: IKeyValue): number;

	merge(...args: any): IKeyValue;

	getId(component: any): string;
}

export interface ICloseModal {
	id: any;
}

export interface ILastModal {
	id: any;
}

export interface IHideModal {
	exceptId: any;
}

export interface IShowModal {
	id: any;
}

export interface IParentCss {
	zIndex?: number;
	[key: string]: any;
}

export interface IChildCss {
	width?: number;
	height?: number;
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	[key: string]: any;
}

export interface ISimpleModalService {
	show(id?: string | boolean): void;

	hide(id?: string | boolean): void;

	close(id?: string | boolean): void;

	open(component: any, data: object, params?: IModalParams): string;
}

export interface IKeyValue {
	[key: string]: any;
}
