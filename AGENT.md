# Gemini Agent Project Guidelines

## 1. Operational Constraints (CRITICAL)
* **NO TOOL LOOPS:** If a tool execution fails or produces an unexpected result **twice in a row**, STOP immediately. Do not retry the same action blindly. Ask the user for clarification or a manual fix.
* **NO GIT PUSH:** You are strictly forbidden from executing `git push`. You may stage (`git add`) and commit (`git commit`) changes if requested, but pushing to remote is permanently reserved for the user.
* **MINIMIZE `runCommand`:**
    * **Do not** use `runCommand` for file operations. Use `readFile`, `editFile`, or `listFiles` instead of `cat`, `grep`, `sed`, or `ls`.
    * **Do not** use `runCommand` to verify file existence; check the file system directly.
    * Only use `runCommand` when absolutely necessary for execution (e.g., running the python script itself, `pip install`, or running tests).

## 2. Python Code Standards
* **Type Hinting:** All function definitions must include Python 3 type hints. Use the `typing` module for complex types (e.g., `List`, `Dict`, `Optional`).
    * *Good:* `def process_data(items: List[str]) -> bool:`
* **Docstrings:** Every function and class must have a docstring describing its purpose, arguments, and return values (Google Style or NumPy Style).
* **Error Handling:** Never use bare `except:` clauses. Always catch specific exceptions (e.g., `except ValueError:`).
* **Formatting:** Follow PEP 8 standards. Assume the user is using a formatter like `Black` or `Ruff`.
* **Path Handling:** Always use `pathlib` for file paths instead of string manipulation or `os.path`.

## 3. Environment & Dependencies
* **Virtual Environment:** Before running any Python code, verify that the virtual environment is active (look for `.venv` or `venv`).
* **Dependency Management:** If you import a package that is not standard usage, immediately check `requirements.txt` (or `pyproject.toml`) to ensure it is listed. If not, ask the user before adding it.

## 4. Testing & Validation
* **Test Before Commit:** If asked to implement a feature, try to run the script or a relevant unit test to verify it works before declaring the task complete.
* **Clean Output:** When writing scripts, ensure they print clear, human-readable logs to `stdout` so the user knows what is happening during execution.