# BPMN Image Annotation Tool

This project is a modification of the [Streamlit Image Annotation](https://github.com/hirune924/Streamlit-Image-Annotation) code by hirune924. It has been adapted to specifically support the labeling and annotation of BPMN (Business Process Model and Notation) diagrams.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Introduction

This project provides an interactive tool for annotating BPMN diagrams using Streamlit. By building on the functionalities of the original [Streamlit Image Annotation](https://github.com/hirune924/Streamlit-Image-Annotation) project, we have customized it to meet the specific needs of BPMN diagram labeling.

## Features

- **BPMN Diagram Upload**: Upload BPMN diagrams directly through the web interface.
- **Annotation Tools for BPMN**: Draw, label, and modify annotations specifically for BPMN elements such as tasks, events, and gateways.
- **Save and Load Annotations**: Save annotations locally and load them when needed.
- **Extended Functionality**: Additional tools and improvements tailored for BPMN diagrams.

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
