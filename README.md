# tracfone

I can't really think of a creative name right now, so I'm gonna stick with `tracfone`.

## Example Output
```json
{
  "minutes": 895,
  "texts": 660,
  "data": 155.09,
  "service_end_date": "01-04-2017",
  "phone_number": "1234567890"
}
```

## Purpose
To scrape phone balance data from my carrier.

I kinda just hacked this together today and felt like publishing it. If you feed the program a
valid TracFone phone number, it'll spit out the minutes, texts, and megabytes remaining. TracFone
offers a pay-as-you-go service, so it's useful to have this data for rationing purposes.

Maybe later I'll shove this data into a machine learning algorithm to predict when I use the most
minutes / text / data.

## Secondary Purposes
Maybe TracFone should bump up their security? It's kind of scary considering that I can check anyone's phone number
with this program, and within 20 seconds find out if their carrier TracFone. And if so, how many minutes
they have remaining on their *personal* plan. Personally, I don't mind the security risk and enjoy being able to
scrape this data. As a plus, now I can graph my family's phone usage. :smirk: If I poll every few minutes, I can
see exactly when people are watching videos, etc.

Also, this program has the fun side effect of being able to scan for legit phone numbers. It takes a while (about 2-3
seconds each), but is definitely doable.

## Requirements
1. Get `nodejs` and `npm`
2. `npm install -g casperjs phantomjs-prebuilt`

## Usage
1. Open up `app.js` with your favorite editor
2. Change `var PHONE_NUMBER = "1234567890"`
3. `casperjs app.js`

## Logging
Additionally, it'll log data to `balance.csv` so that you can periodically record entries. Use cron or a bash while
loop for this, e.g. `while true; do casperjs app.js; sleep 60; done`.

## Graphing
todo, but on the way
