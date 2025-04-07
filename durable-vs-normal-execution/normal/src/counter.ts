const sleep = (seconds: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

async function main(): Promise<void> {
    for (let i = 1; i <= 10; i++) {
        console.log(i);
        await sleep(1);
    }
}

main().catch(error => {
    console.error('An error occurred:', error);
});