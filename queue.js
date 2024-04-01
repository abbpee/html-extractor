var queue = [];
var isRunning = false;

var queueTimer = setInterval(run, 3000);

async function run() {
    if (isRunning) {
        return true;
    }

    isRunning = true;
    while (queue.length) {
        let job = queue.shift();

        try {
            let data = null;
            if (job.procedure.constructor.name === 'AsyncFunction') {
                data = await job.procedure();
            } else if (job.procedure.constructor.name === 'Function') {
                data = job.procedure();
            }

            job.onResult(data);
        } catch (err) {
            job.onResult(null);
            console.error(err);
        }
    }

    isRunning = false;
}


export default function (procedure, onResult) {
    let id = Math.round(Math.random() * 1000);
    queue.push({procedure: procedure, id: id, onResult: onResult});
}
