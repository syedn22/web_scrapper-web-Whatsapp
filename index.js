const { chromium } = require("playwright");

const URL = "https://web.whatsapp.com/";
const groupClassName = "._1gL0z";

// const scrapper = async () => ;

async function scrappMessages(groupName, numberOfMessages) {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  });

  const messageClassName = "div._1bR5a";
  const timeSelector = "div.xkqQM.copyable-text";
  const timeSelectorAttribute = "data-pre-plain-text";

  const page = await browser.newPage();
  await page.goto(URL);

  await page.waitForSelector("body");

  await page.click(`text=${groupName}`);
  await page.click(groupClassName);

  for (let i = 0; i < numberOfMessages; i++)
    await page.keyboard.press("ArrowUp");

  let messages = await page.evaluate(() => {
    let allMessages = document.body.querySelectorAll("div._1bR5a");

    let chatMessages = [];
    let previousMessage = "";

    allMessages.forEach((item) => {
      let messageBody = item.innerText.split("\n");
      let text = "",
        messagedBy = "";

      let time = "";
      try {
        time = item
          .querySelector("div.xkqQM.copyable-text")
          .getAttribute("data-pre-plain-text");

        console.log(time);
      } catch (er) {}

      if (messageBody.length > 2) {
        messagedBy = messageBody[0];
        previousMessage = messageBody[0];
        for (let i = 1; i < messageBody.length - 1; i++) {
          text += " ";
          text += messageBody[i];
        }
      } else {
        messagedBy = previousMessage;
        text = messageBody[0];
        time = messageBody[1];
      }

      chatMessages.push({
        text,
        messagedBy,
        time,
      });
    });

    return chatMessages;
  });

  console.log(messages);
}

scrappMessages("Covid-19 =hackathon", 100);
