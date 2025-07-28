import { pollAndPublishBatch } from "./PollerWorker";


let activePollers=0;
const MAX_ACTIVE=2;
const POLL_INTERVAL_MS=5000;
setInterval(async()=>{
    if(activePollers>=MAX_ACTIVE){
        return;
    }
    activePollers++;
    const pollerId=`poller-${Date.now()}`;
    console.log(`starting poller ${pollerId}`);
    try {
        await pollAndPublishBatch(pollerId);
    }
    catch (e) {
        console.error(`${pollerId} failed to poll and publish`, e);

    }
    finally {
        activePollers--;
        console.log(`finished poller ${pollerId}`);
    }
},POLL_INTERVAL_MS);