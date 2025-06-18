# EHR Extraction - FastAPI

## Overview
This project is a FastAPI application designed to provide a robust backend for managing electronic health records (EHR). It includes a set of API endpoints for interacting with health data and is structured to facilitate easy development and documentation.

## Installation

You'll need Python 3.11+ and [`uv`](https://github.com/astral-sh/uv), a fast package manager:


To set up the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd backend
   ```

3. Install the dependencies:
   ```
   uv sync
   ```


## Usage
To run the FastAPI application, execute the following command:
```
uv run python app.py
```
The application will start, and you can access the API documentation at `http://localhost:8000/docs`.

## Documentation
Documentation for the project is generated using Sphinx. To build the HTML docs, run:
```
cd docs
sphinx-apidoc -o . ../src --module-first --separate
make html
```
The generated documentation will be available in the `_build/html` directory.
To include missing modules in the index, update `index.rst` to include:
```
.. toctree::
   :maxdepth: 2
   :caption: API Modules:

   src.module1
   src.module2
   ...

```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.