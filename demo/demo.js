// 任务调度器

let taskId = 1;
function eventLoop(deadline) {
    taskId++;
    let remain = deadline.timeRemaining();
    // 当前空余时间已经不够1ms了，不在执行任务
    while (remain > 1)  {
        console.log('task = ', taskId);
        remain = deadline.timeRemaining();
    }
    requestIdleCallback(eventLoop);
}

requestIdleCallback(eventLoop);