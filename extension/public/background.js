// background.js

function openWebsite() {
    console.log("openWebsite called"); // This will log to the background page's console
    const website = 'https://netflix.com'; // Replace with your desired URL
    chrome.tabs.create({ url: website });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed, setting timeout..."); // This will log when the extension is installed
    setTimeout(() => {
        console.log("Timeout completed, opening website..."); // This will log right before opening the website
        openWebsite();
    }, 6000);
});
