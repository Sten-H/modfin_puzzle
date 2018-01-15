const Heap = require("collections/heap");
const requestify = require('requestify');

/**
 * Chose to use a kind of min max heap because insert will be O(log n), and getting the median will be O(1)
 * where the median will be either the root of largest (length) heap or the average of both heap roots. Building
 * the heap from n elements should be O(n*log n).
 */
class MedianHeap {
	constructor() {
		this.minHeap = new Heap([], null, (a, b) => b - a);
		this.maxHeap = new Heap([], null, (a, b) => a - b)
	}
	_balance() {
		const lenDiff = this.minHeap.length - this.maxHeap.length;
		if (lenDiff >= 2) {
			this.maxHeap.add(this.minHeap.pop())  // move minHeap root to maxHeap
		} else if (lenDiff <= -2) {
			this.minHeap.add(this.maxHeap.pop())  // remove maxHeap root to minHeap
		}
	}
	add(key) {
		if(this.minHeap.length === 0 || key > this.minHeap.peek()) {
			this.minHeap.push(key);
		} else {
			this.maxHeap.push(key);
		}
		this._balance()
	}
	median() {
		if(this.minHeap.length > this.maxHeap.length) {
			return this.minHeap.peek();
		} else if(this.minHeap.length < this.maxHeap.length) {
			return this.maxHeap.peek();
		} else {
			return ( this.minHeap.peek() + this.maxHeap.peek() ) / 2
		}
	}
}

/**
 * Calculates median exchange rate of one currency to another within a given timeframe
 * @param {string} startDate Date as string given in YYYY-MM-DD format
 * @param {string} endDate Date as string given in YYYY-MM-DD format
 * @param {string} fromCurrency Currency acronym/abbreviation
 * @param {string} toCurrency Currency acronym/abbreviation
 * @returns {Promise.<Number>}
 */
const calcMedianExchange = (startDate, endDate, fromCurrency, toCurrency) => {
	const heap = new MedianHeap();
	return requestify.get(`http://fx.modfin.se/${startDate}/${endDate}?base=${fromCurrency}&symbols=${toCurrency}`)
		.then(response => response.getBody())
		.then(data => {
			// build heap
			data.forEach(item => heap.add(item.rates[toCurrency.toUpperCase()]));
			return heap.median();
		});
};

// Solution to particular problem posed, run in console with "npm run solution"
const solution = () => calcMedianExchange('2017-01-01', '2017-12-31', 'usd', 'sek')
	.then(median => console.log(`The median exchange rate is ${median} sek.`));

module.exports = {
	MedianHeap: MedianHeap,
	calcMedianExchange: calcMedianExchange,
	solution: solution
};