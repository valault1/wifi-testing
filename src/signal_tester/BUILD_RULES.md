# Android Build Verification Rules

1. **Always Validate Locally:** Before prompting the user to submit an application to EAS Build in the cloud (which takes a long time), you must **always** test compilation locally.
2. **Command:** Run `export JAVA_HOME=$HOME/java/jdk17; export PATH=$JAVA_HOME/bin:$PATH; export ANDROID_HOME=$HOME/Android/cmdline-tools; cd /home/val/wifi-testing/src/signal_tester/android && ./gradlew assembleRelease` via the `run_command` tool to catch any Kotlin, syntax, or React Native dependency errors.
3. **Log Output Location:** ALWAYS redirect output (`>`) to a log file inside the project directory (e.g., `~/wifi-testing/src/signal_tester/gradle.log`) so you have permission to read it using the workspace `view_file` tool.
4. Only advise the user to run the EAS CLI after this local check exits with code `0`.
