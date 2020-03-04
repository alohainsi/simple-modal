// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Core
import { SimpleModalBroadcaster } from './__/simple-modal.broadcaster';
import { SimpleModalHelper } from './__/simple-modal.helper';
// Component
import { SimpleModalComponent } from './simple-modal.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		SimpleModalComponent
	],
	exports: [
		SimpleModalComponent
	],
	providers: [
		SimpleModalBroadcaster,
		SimpleModalHelper
	],
	entryComponents: [
		SimpleModalComponent
	]
})
export class SimpleModalModule {
}
