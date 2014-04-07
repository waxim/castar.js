# Castar.js
A simple currency conversion lib written in JS. You can set currency exchange rates, displays and symbols and convert between them on the fly.

# Kitchen Sink
```js

var currency = new Castar();

// Add some currencies
currency.add('GPB', { symbol: '&pound;', decimals: 2, name: 'British Pound Sterling' });
currency.add('EUR', { symbol: '&euro;', decimals: 2, name: 'Euros' });
currency.add('USD', { symbol: '&dollar;', decimals: 2, name: 'United States Dollar' });
currency.add('ZWD', { symbol: 'Z&dollar;', decimals: 2, name: 'Zimbabwe Dollar');

// or remove one if you want
// currency.remove('ZWD');

// Set a base currency (a base has a value of 1)
currency.base('GPB');

// Set some exchange rates
currency.rate('USD',1.66);
currency.rate('EUR',1.21);
currency.rate('ZWD',600.464);

// Set the active currency
currency.set('EUR');

// Calculate and display value
currency.display(12); // &euro;14.52 (which would render to €14.52 in HTML)

// or just get the value
currency.calculate(12); // 14.52

```
You can also have castar convert between two currencies that are not the base,

```js
currency.display(12,'USD','ZWD'); // Z$11,961.24
currency.calculate(12,'USD','ZWD'); // 11961.24
```

# .auto()
Castar has the ability to bind to the DOM and auto convert values as the active currency is switched. Triggering ``.auto()`` on a castor object will parse the DOM and convert any waiting values. It will also set an event to watch for changes in .base(), .active() or .rate() and will update the relevant values in the DOM.

```js
currency.auto();
```

Then you can add the ``castar`` class to any elements you wish to convert, you can also attach some data attribuites.

```html
<span class='castar' data-currency='USD'>19.99</span>
```

Would render to

```html
<span class='castar' data-original-value='19.99' data-currency='USD'>&dollar;33.18</span>
```

You can also supply a from currency if you like,

```html
<span class='castar' data-from-currency='USD' data-currency='ZWD'>12</span>
```

renders to,

```html
<span class='castar' data-original-value='12' data-from-currency='USD' data-currency='ZWD'>Z&dollar;11,961.24</span>
```

__Developer Note__ The auto event  callbacks (the ones that watch for changes should be triggered AFTER the castar events listed below to avoid getting stuck in middle earth)

# Events
Castar has some built in events you can attach callbacks to.

```js

// When a new Castar instance is created
currency.on('init',function(){
	console.log('Your have made a new castar, Gondor would be proud.'); 
});

// When the active currency is switched
currency.on('switch',function(from, to){
	console.log('Your currency switched from '+from.name+' to '+to.name); 
});

// When a currency is added
currency.on('add',function(added){
	console.log('You added a new currency called '+added.name); 
});

// When a currency is removed
currency.on('remove',function(removed){
	console.log('You removed a currency called '+removed.name); 
});

// When the base currency is changed
currency.on('base',function(base){
	console.log('You just set the base currency to '+base.name); 
});

// When the rate for a currency is added
currency.on('rate-added',function(currency, value){
	console.log('You just set the conversion rate for '+currency.name+' to '+value); 
});

// When the rate for a currency is updated
currency.on('rate-updated',function(currency, from, to){
	console.log('You just updated the conversion rate for '+currency.name+' from '+from+' to '+to); 
});

// When a display is triggered
currency.on('display',function(in, currency, out){
	console.log('You just requested to display the converted value of '
		+ in 
		+ ' the active currency was '
		+ currency.name 
		+ ' and the returned value was '
		+ out
	); 
});

// When a calculate is triggered
currency.on('calculate',function(in, currency, out){
	console.log('You just requested a calculation for the value '
	+ in+' the active currency was '+currency.name 
	+ ' and the returned value was '+out); 
});

// When a auto is turned on
currency.on('auto-on',function(){
	console.log('You just turned auto on'); 
});

// When a auto is turned off
currency.on('auto-off',function(){
	console.log('You just turned auto off'); 
});

```