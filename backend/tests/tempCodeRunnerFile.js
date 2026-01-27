
setTimeout(async () => {
  clearInterval(checkInterval);
  console.log('\n🛑 Stopping worker...\n');
  await worker.stop();
  