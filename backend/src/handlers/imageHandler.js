
async function imageHandler(payload)  {
    const {width, height} = payload;

    console.log(`Image has been resizing to ${width} width and ${height} height`);

    await new Promise((resolve) => {
        setTimeout(() => {
            console.log('Wait 3 sec to finish the resizing');
            resolve();
        }, 3000)
    })

    if(Math.random() < 0.5) {
        throw new Error('Failed to resizing the image');
    }
    console.log('Resizing Complete');
}

export {
    imageHandler
}