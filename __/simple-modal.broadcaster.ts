// Angular
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// RxJs
import { filter, map } from 'rxjs/operators';

// Other
import { IBroadCaster } from './simple-modal.interfaces';

@Injectable({
	providedIn: 'root'
})

/**
 * Export class SimpleModalBroadcaster
 */
export class SimpleModalBroadcaster {
	/**
	 * Event emitter
	 * @type Subject<IBroadCaster>
	 */
	private _eventBus: Subject<IBroadCaster> = new Subject<IBroadCaster>();

	/**
	 * Emit data to the specific event
	 * @param {string} key
	 * @param {any} data
	 * @return void
	 */
	public emit(key: string, data?: any): void {
		this._eventBus.next({key, data});
	}

	/**
	 * Subscribe to the new event
	 * @param {string} key
	 * @return {Observable<T>}
	 */
	public on<T>(key: any): Observable<T> {
		return this._eventBus.asObservable().pipe(
			filter(event => event.key === key),
			map(event => <T>event.data)
		);
	}
}
