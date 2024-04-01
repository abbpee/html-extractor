import {default as extract} from './extractor.js';
import {default as queue} from './queue.js';

queue(async () => {
    return await extract('https://google.com');
}, (data) => {
    console.log(data);
});
