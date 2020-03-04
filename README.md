## SUMMARY:
The same as Angular Material Dialog, but more light.

## How to use it

#### 1. Import the package (service and module)
`import { SimpleModalService, SimpleModalModule  } from '@upr-web-primer/simple-modal';`

#### 2. Create a new instance in a constructor for the service
`constructor(private simpleModal: SimpleModalService)`

#### 3. Use it :-)
`use the needed public method`

### Public method in service

```
/**
 * Show the modal
 *  => sm.show(false|true) - gonna close all modals
 *  => sm.show('ComponentNameId') - gonna show a modal with id "ComponentNameId"
 *  => sm.show() - gonna show the last opened modal
 * @param {string|boolean} id
*/
```

```
/**
 * Hide the modal
 *  => sm.hide(false|true) - gonna hide all existing modals
 *  => sm.hide('ComponentNameId')	- gonna hide a modal with id "ComponentNameId"
 *  => sm.hide() - gonna hide the last opened modal
 * @param {string|boolean} id
 */
```
```
/**
 * Close the modal
 * => sm.close(false|true) - gonna close all existing modals
 * => sm.close('ComponentNameId') - gonna close a modal with id "ComponentNameId"
 * @param {string} id
*/
```

```
/**
	 * Open modal
	 * => sm.open('ComponentNameId', data, options) - gonna open a new modal with a "ComponentNameId" in inside (component name is a string)
	 * => sm.open(Component, data, options) - gonna open a new modal with a "Component" in inside (component is an instance)
	 * => sm.open(Component, data, {
	 * 		position: T_MODAL_POSITION.TOP // the modal position would be in a top of a page
	 * 		// If a position different then center, it would be good to specify dimensions for the device types,
	 * 		otherwise SimpleModal gonna use default values from config itself
	 * 		dimensions: {
	 * 			mobile: {height: 30}, // Modal width for the mobile devices
				tablet: {height: 25}, // Modal width for the tablet devices
				desktop: {width: 100, height: 20}, // Modal width for the desktop devices
				isPercent: true // Default value. Gonna calculate dimensions in percent, otherwise in pixel
	 * 		},
	 * 		 isShade: true // gonna display the shade for the modal
	 * 	})
	 * @param {any} component
	 * @param {any} data
	 * @param {I_MODAL_PARAMS} params
	 * @return {string}
*/
```
### Few examples

#### Position: CENTER

```
this.simpleModal.open(
	'TestSimpleModalComponent', // Component name (string), by default position is center
	{
		firstName: 'CENTER',
		lastName: 'Modal'
	},
        {
               mobile: {height: 30}, // Modal width for the mobile devices
	        tablet: {height: 25}, // Modal width for the tablet devices
		desktop: {width: 100, height: 20}, // Modal width for the desktop devices
		isPercent: true // Default value. Gonna calculate dimensions in percent, otherwise in pixel
        }
);
```

#### Position: RIGHT
```
this.simpleModal.open(
	'TestSimpleModalComponent', // Component name (string)
	{ // The data to pass to the component
		firstName: 'Right',
		lastName: 'Side menu'
	},
	{
		position: T_MODAL_POSITION.RIGHT // Position, by default it's a center
	}
);
```

#### Position: LEFT
```
// Open simple modal
this.simpleModal.open(
	TestSimpleModalComponent,  // Component name (instance)
	{ // The data to pass to the component
		firstName: 'Left',
		lastName: 'Side Menu'
	},
	{
		position: T_MODAL_POSITION.LEFT // Position, by default it's a center
	}
);
```

#### Position: TOP
```
this.simpleModal.open(
	'TestSimpleModalComponent', // Component name (string)
	{ // The data to pass to the component
		firstName: 'Top',
		lastName: 'Side Menu'
	},
	{
		position: T_MODAL_POSITION.TOP // Position, by default it's a center
	}
);
```

#### Position: BOTTOM
```
this.simpleModal.open(
	'TestSimpleModalComponent',
	{
		firstName: 'BOTTOM',
		lastName: 'Side Menu'
	},
	{
		position: T_MODAL_POSITION.BOTTOM
	}
);
```
