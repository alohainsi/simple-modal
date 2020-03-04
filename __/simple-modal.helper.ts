// Angular
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Inject, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { IKeyValue, ISimpleHelper } from './simple-modal.interfaces';
import { DOCUMENT } from '@angular/common';

@Injectable({
	providedIn: 'root'
})

/**
 * Export SimpleModalHelper
 */
export class SimpleModalHelper implements ISimpleHelper {
	/**
	 * Constructor
	 * @param {ComponentFactoryResolver} componentResolver
	 * @param {ApplicationRef} appRef
	 * @param {Injector} injector
	 * @param {any} document
	 */
	constructor(private componentResolver: ComponentFactoryResolver,
							private appRef: ApplicationRef,
							private injector: Injector,
							@Inject(DOCUMENT) private document: any) {
	}

	/**
	 * Dispatch for code
	 * @param {any} event
	 * @return {string|number}
	 */
	dispatchForCode(event: any): string | number {
		let code;

		if (event.key !== undefined) {
			code = event.key;
		} else if (event.keyIdentifier !== undefined) {
			code = event.keyIdentifier;
		} else if (event.keyCode !== undefined) {
			code = event.keyCode;
		}

		return code;
	}

	/**
	 * Generate random id
	 * @return {string}
	 */
	generateId(): string {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}

	/**
	 * Create component dynamically
	 * @param component
	 * @param {object} data
	 * @param {ViewContainerRef} container
	 * @return {ComponentRef<any>}
	 */
	createComponent(component: any, data?: IKeyValue, container?: ViewContainerRef): ComponentRef<any> {
		// Define component variable
		let componentRef: ComponentRef<any>;

		// Get component instance from factory resolver
		const getComponent = (componentName: string) => {
			// @ts-ignore "_factories" is private property, that's why we need ts-ignore in here, don't remove it, it would not reflect on anything
			const factories = Array.from(this.componentResolver['_factories'].keys());
			return <any>factories.find((x: any) => x.name.toLowerCase() === componentName.toLowerCase());
		};

		// Pass data to the component
		const passData = (ref: ComponentRef<any>) => {
			// If we got params
			if (data) {
				for (const x in data) {
					if (data.hasOwnProperty(x)) {
						ref.instance[x] = data[x];
					}
				}
			}
		};

		// Get component factory
		const factory = this.componentResolver.resolveComponentFactory(component.name ? component : getComponent(component));

		// If container already specified
		if (!container) {

			// Create component instance
			componentRef = factory.create(this.injector);

			// Pass the data to the component
			passData(componentRef);

			// Attach component to the appRef so that it's inside the ng component tree
			this.appRef.attachView(componentRef.hostView);

			// Append component to the body
			this.document.body.appendChild((componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement);

			// We should add a new component to the <body>
		} else {

			// Create component instance
			componentRef = container.createComponent(factory);

			// Pass the data to the component
			passData(componentRef);

			// Detect changes
			componentRef.changeDetectorRef.detectChanges();
		}

		// Return references
		return componentRef;
	}

	/**
	 * Get object sizeof
	 * @param {IKeyValue} obj
	 * @return {number}
	 */
	sizeOf(obj: IKeyValue): number {
		let size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				size++;
			}
		}
		return size;
	}

	/**
	 * Merge objects|array
	 * @param {any} args
	 * @return {IKeyValue}
	 */
	merge(...args: any): IKeyValue {
		const obj: IKeyValue = {};
		args.forEach((val: any) => {
			for (const x in val) {
				if (val.hasOwnProperty(x)) {
					obj[x] = val[x];
				}
			}
		});
		return obj;
	}

	/**
	 * Get modal id by component name
	 * @param {any} component
	 * @return {string}
	 */
	getId(component: any): string {
		return (component + '').toLowerCase();
	}
}
