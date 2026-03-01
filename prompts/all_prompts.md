> Update to csv
Currently, the main script in this folder runs a speed test, and writes the results to an individual file in reports.

Can you make it towhere it outputs a row in a csv instead? Put the CSV in reports, and name it something like speed-test-results.csv. 

For the information to output, be sure to include the date/time, the result, the SSID, the band, the megahertz, and anything else you can find that would be useful!

> Speed test server - python
Ok, I want to try a new infrastructure.

Don't delete any of the existing code, but add a new folder under src named "speedtest_server", and make a new python REST server. It needs two endpoints:

1. a health check - just returns 200 if it's healthy!
2. A speed test - performs the speed test, and  returns the results (or any errors that occurred). I think it's a good idea to also save the results locally to a new file under the reports folder. For this speed test, you can look at the implementation in the current main.py to understand, but you'll need to cut a lot out of it now that it's not a central script anymore! We want this to be as simple, clean, and fast as possible.

After you're done writing this new server, go ahead and run it, and then send it some calls to make sure it works! You might even find that it's easiest to make a test file that runs a suite of these calls. 

Keep trying until it works, and then we'll have a beautiful speed test server!