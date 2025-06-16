// use this to show borders around the elements selected on the page
// function injectSheetsButtons() {
//   const buttons = [
//     {
//       popover: 'Add to tracker',
//       icon: '🔌',
//       func: () => {
//         console.log('adding to tracker');
//       },
//     },
//     {
//       popover: 'Specify header',
//       icon: '🖊️',
//       func: () => {
//         console.log('specify header');
//       },
//     },
//   ];
//   const [container] = document.getElementsByClassName('docs-titlebar-badges');

//   // for my sake we could just replace them?
//   const dupeElms = document.getElementsByClassName('sheet-tracker');
//   if (container && dupeElms.length === 0) {
//     console.log('found container add buttons');
//     buttons.forEach((button) => {
//       console.log('button');
//       const div = document.createElement('div');
//       const nestDiv = document.createElement('div');
//       const nestDiv2 = document.createElement('div');
//       div.classList = 'docs-titlebar-badge-container goog-inline-block sheet-tracker';
//       nestDiv.classList = 'goog-control';
//       nestDiv2.classList = 'docs-titlebar-badge';
//       nestDiv.setAttribute('data-tooltip', button.popover);
//       const btn = document.createElement('button');
//       btn.style.cursor = 'pointer';
//       btn.classList = 'docs-icon goog-inline-block';
//       btn.onclick = button.func;
//       btn.innerHTML = button.icon;
//       nestDiv2.append(btn);
//       nestDiv.append(nestDiv2);
//       div.append(nestDiv);
//       container.append(div);
//     });
//   } else {
//     console.log('unanestDiv2le to add btns');
//     console.log('unanestDiv2le to add btns');
//   }
// }

// a domain map will map to our sheets that are linked to it
// its possible to have many sheets that map to the same one?
// should we do this now? or expect user to press button to see if page is in domain map?

/**
 * Not going to use this here for now because I'm unsure of page loading
 * mechanisms. Will be easier to wait for click to send out borders on page
 */

// function injectBorders() {}

// we might no longer need service worker? maybe
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// if (
//   changeInfo.status === 'complete' &&
//   tab.url
//   // && tab.url.includes('https://docs.google.com')
// ) {
//   chrome.scripting.executeScript({
//     target: {
//       tabId,
//     },
//     func: injectSheetsButtons,
//   });
// }
// });

// chrome.commands.onCommand.addListener((command) => {
//   if (command === commandTypes.paste) {
//     // you can set a setting value here too?
//     chrome.action.openPopup();
//   }
// });
