#!/usr/bin/env casperjs

// configuration
var CSV = "balance.csv";
var PHONE_NUMBER = "1234567890";
var VERBOSE = false;

var fs = require("fs");
var casper = require("casper").create();
casper.start();

var start_date = undefined;

// http://stackoverflow.com/a/36850010
// wait until loading window disappears
function step(phone_number) {
    return function() {
        if (casper.exists("div.blockUI")) {
            var seconds_elapsed = (new Date() - start_date) / 1000;

            if (VERBOSE)
                console.log("Time elapsed: " + seconds_elapsed.toFixed(2) + " seconds");

            casper.wait(500, step(phone_number));
        } else {
            casper.then(function() {
              //this.capture("balance.png");

                // extract the fields
                var balance = {
                    minutes: this.fetchText("#minutes"),
                    texts: this.fetchText("#msg"),
                    data: this.fetchText("#mb"),
                    service_end_date: this.fetchText("#service")
                };

                // extract the values from the strings
                for (var key in balance) {
                    balance[key] = balance[key].split(": ")[1];

                    // parse numbers
                    if (key !== "service_end_date") {
                        balance[key] = parseFloat(balance[key]);
                    }

                }

                // tag phone number onto balance object
                balance.phone_number = phone_number;

                console.log("\n" + JSON.stringify(balance, null, 2) + "\n");
                write_to_csv(balance);
            });
        }
    };
}

function write_to_csv(balance) {
    // create file if necessary
    if (!fs.exists(CSV))
        fs.write(CSV, "phone_number,epoch,time_elapsed,minutes,texts,data,service_end_date\n", "w");

    var epoch = (new Date()) / 1000;
    var te = (epoch - start_date/1000).toFixed(2);
    var line = [balance.phone_number, epoch, te, balance.minutes,
                balance.texts, balance.data, balance.service_end_date].join(",");

    console.log(line);
    fs.write(CSV, line+"\n", "a");
}

function fetch_balance(phone_number) {
    start_date = new Date();
    casper.thenOpen("https://www.fastactportal.com/static/balance");

    // fill in login form
    casper.waitForSelector("input#min", function() {
        this.sendKeys("input#min", phone_number);
    });

    // hit submit
    casper.waitForSelector("input#numberSubmit", function() {
        this.click("input#numberSubmit");
    });

    casper.then(step(phone_number));
}

function pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

fetch_balance(PHONE_NUMBER);
casper.run();
