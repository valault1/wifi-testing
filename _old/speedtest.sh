#!/bin/bash
# Log the date and the speed test results to a file
echo "--- $(date) ---" >> ~/router_benchmark.log
npx speed-cloudflare-cli >> ~/router_benchmark.log
echo "" >> ~/router_benchmark.log

