(function(){
	
	var castar = function(options){
		
		/* An object to hold all our currencies */
		this._table = {};
		
		/* Set a list of our allowed events */
		this._events = ['switch','add','remove','base','rate-added','rate-updated','display','calculate','auto-on','auto-off'];
		
		/* A holder for our 'base' object key */
		this._base = '';
		
		/* A holder for our 'active' object key */
		this._active = '';
		
		/* A holder for 'castar' elements for auto binding */
		this._elements = [];
		
		/* Auto? */
		this._auto = 0;
		
		/* Some configurable options */
		this.options = options || {};
		this.options.base = this.options.base || 1;
		this.options.decimals = this.options.decimals || 2;
		this.options.selector = this.options.selector || 'castar';
		
		/*
		* @desc function to see if a currency exists
		*/
		this._exists = function(cur){
			return (typeof this._table[cur] == 'undefined' ? false : true);
		}
		
		/*
		* @desc function to return the object for the active currency
		*/
		this.active = function(){
			this._exists(this._base) ? this._table[this._base] : {};
		}
		
		/*
		* @desc a function to collect all castar elements from the dom
		*/
		this.collect = function(){
			var elems = document.getElementsByTagName('*'), i;
			for (i in elems) {
				if((' ' + elems[i].className + ' ').indexOf(' ' + this.options.selector + ' ') > -1) {
					this._elements.push(elems[i]);
				}
			}
		}
		
		
		/*
		* @desc function to add a currency object to castar
		*/
		this.add = function(cur,obj){
			if(typeof obj['name'] != 'undefined' && typeof obj['symbol'] != 'undefined'){
				this._table[cur] = obj;
				this.trigger('add',obj); // trigger our add event
				return this;
			} else {
				throw new Error('Castar: A currency object requires both a name and a symbol');
			}
		}
		
		/*
		* @desc function to remove a currency object from castar
		*/
		this.remove = function(cur){
			if(this._exists(cur)){
				var obj = this._table[cur];
				delete this._table[cur];
				this.trigger('remove',obj); // trigger our remove event
				return this;
			} else {
				throw new Error('Castar: You can not delete a currency that does not exist.');
			}
		}
		
		/*
		* @desc function to set our base currency
		*/
		this.base = function(cur){
			if(this._exists(cur)){
				this._base = cur;
				this.trigger('base'); // trigger our base event
				this.update(); // if auto - redraw our dom
				return this;
			} else {
				throw new Error('Castar: Requested currency does not exist.');
			}
		}
		
		/*
		* @desc function to set a rate for a given currency
		*/
		this.rate = function(cur,rate){
			if(this._exists(cur)){
				
				if(this._table[cur]['rate'] == 'undefined'){
					this._table[cur]['rate'] = rate;
					this.trigger('rate-added',this._table[cur]);
				} else {
					var old_rate = this._table[cur]['rate'];
					this._table[cur]['rate'] = rate;
					this.trigger('rate-updated',old_rate,rate);
				}
				
				this.update(); // if auto - redraw our dom
				return this;

			} else { 
				throw new Error('Castar: We could not set a rate for that currency as it does not exist.');
			}
		}
		
		/*
		* @desc function to set an active currency
		*/
		this.activate = function(cur){
			if(this._exists(cur)){
				if(this._exists(this._active)){
					var from = this._table[this._active];
					var to = this._table[cur];
					this._active = cur;
					this.trigger('switch',from,to);
				} else {
					this._active = cur;
					this.trigger('activate',this._table[cur]);
				}
				
				return this;
				
			} else {
				throw new Error('Castar: We could not activate that currency as it does not exist.');
			}
		}


		/*
		* @desc function to toggle auto updating of the dom
		*/
		this.auto = function(){
			if(this._auto == 0){
				this._auto = 1;
				this.trigger('auto-on');
				this.collect(); // recollect our elements.
				this.update();
			} else {
				this._auto = 0;
				this.trigger('auto-off');
			}
			
			return this;
		}
		
		/*
		* @desc function to redraw our dom bindings
		*/
		this.update = function(){
			// Foreach every element, if has orginal-value get it and rerun conversion on 'active' ... unless it has a from-currency then use that
			for(key in this._elements){
				var ele = this._elements[key];
				
				var to = ele.getAttribute('data-currency') || this._active;
				var from = ele.getAttribute('data-from-currency') || this._base;
				
				var original_value = ele.getAttribute('data-original-value') * 1;
				var value = parseInt('0'+ele.innerHTML);
				// If we have original value set value to that for conversion
				if(original_value > 0){
					value = original_value;
				}
				ele.setAttribite('data-original-value',value);
				var result = this.calculate(value,from,to);
				ele.innerHTML = result;
				
			}
		}
		
		
		/*
		* @desc function to calculate a converted value in the active currency
		*/
		this.calculate = function(value, from, to){
			// if from different from base, get ratio to convert on
			
			// make sure we have a rate and run it.
			return value * 2;
		}
		
		/*
		* @desc function to display a converted value in the active currency
		*/
		this.display = function(value){ }
		
		/*
		* @desc function to add trigger an event callback
		*/
		this.trigger = function(fun){
			return true;
		}
		
		/*
		* @desc function to register an event callback
		*/
		this.on = function(fun, callback){ }
		
	}
	
	window.Castar = castar;
})();

var cur = new Castar;
