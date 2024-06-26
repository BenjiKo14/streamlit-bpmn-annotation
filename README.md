# My Project: Streamlit Image Annotation

This project is a modification of the [Streamlit Image Annotation](https://github.com/hirune924/Streamlit-Image-Annotation) code by hirune924. It extends the functionality of the original project to suit the specific needs of our use case.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Introduction

This project provides a streamlined and interactive way to annotate images using Streamlit. By leveraging the functionalities of the original [Streamlit Image Annotation](https://github.com/hirune924/Streamlit-Image-Annotation) project, we have tailored it to better fit our requirements.

## Features

- **Image Upload**: Upload images directly through the web interface.
- **Annotation Tools**: Draw, label, and modify annotations on images.
- **Save and Load Annotations**: Save annotations locally and load them when needed.
- **Extended Functionality**: Additional tools and improvements for a better user experience.

## Installation

To set up the project, follow these steps:

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/yourusername/your-repository.git
    cd your-repository
    ```

2. **Install Dependencies**:
    Add the following line to your `requirements.txt` to install the original project as a package:
    ```plaintext
    git+https://github.com/hirune924/Streamlit-Image-Annotation.git@main
    ```

3. **Optional**: If you use a `setup.sh` file, include the following:
    ```sh
    #!/bin/bash

    # Install the GitHub package
    git clone https://github.com/hirune924/Streamlit-Image-Annotation.git
    cd Streamlit-Image-Annotation
    pip install .
    cd ..

    # Install other dependencies
    pip install -r requirements.txt
    ```

## Usage

To run the application, use the following command:
```sh
streamlit run app.py
