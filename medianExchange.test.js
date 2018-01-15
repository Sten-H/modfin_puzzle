const { MedianHeap, calcMedianExchange } = require('./medianExchange');
const testData = require('./testData');  // Test data is exchange rate of usd -> sek in all of 2017

// helper functions
const randomArray = (length, max) => [...new Array(length)].map(() => Math.round(Math.random() * max));
const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
const sortedMedian = arr => {
	const a = [...arr].sort((a, b) => a - b);
	if (a.length % 2 === 0)
		return (a[a.length / 2] + a[a.length / 2 - 1]) / 2;
	else
		return a[a.length / 2];
};
const exchangeMedianFromSorted = (data, toCurrency) => sortedMedian(data
	.map(item => item.rates[toCurrency.toUpperCase()]));

describe('Solution', () => {
	it('Heap median should be same as sorted array median', () => {
		const expected = exchangeMedianFromSorted(testData, 'sek');
		// Build median heap
		const heap = new MedianHeap();
		testData.forEach(item => heap.add(item.rates.SEK));
		// compare median to sorted median of same values
		expect(heap.median()).toEqual(expected);
	});
	it('Test calcMedianExchange', () => {  // Tests with actual GET request to API
		expect.assertions(1);
		const median = calcMedianExchange('2017-01-01', '2017-12-31', 'usd', 'sek');
		const expected = exchangeMedianFromSorted(testData, 'sek');
		return expect(median).resolves.toEqual(expected);
	});
});

describe('Median Heap', () => {
	describe('Add', () => {
		it('Simple add without balancing needed', () => {
			const heap = new MedianHeap();
			heap.add(10);
			heap.add(5);
			expect(heap.minHeap.content).toEqual([10]);
			expect(heap.maxHeap.content).toEqual([5]);
		});
		it('Simple add with balancing needed', () => {
			const heap = new MedianHeap();
			heap.add(10);
			heap.add(15);
			expect(heap.minHeap.content).toEqual([15]);
			expect(heap.maxHeap.content).toEqual([10]);
		});
	});
	describe('Median', () => {
		it('Should take average median from same sized heaps', () => {
			const heap = new MedianHeap();
			heap.add(10);
			heap.add(15);
			expect(heap.median()).toBe(12.5);
		});
		it('Gets correct median from medium sized input', () => {
			let vals = [1,10,23,29,200,235,500,620,2310,2340,5100,23905];
			const heap = new MedianHeap();
			shuffleArray(vals);
			for(let x of vals) {
				heap.add(x);
			}
			expect(heap.median()).toBe(367.5);  // sort of a regression test I suppose
		});
		it('Gets correct median from large array with random inputs', () => {
			const vals = randomArray(200, 5000);
			const heap = new MedianHeap();
			for(let x of vals) {
				heap.add(x);
			}
			expect(heap.median()).toBe(sortedMedian(vals));
		});
	});
});