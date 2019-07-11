# scribe-js

Experimental tool that helps documenting JS files.

It provides a GUI through generated HTML pages, and makes the resulting file available through a local download.

### Usage:

`node . path_to_file.js`

### Dependencies:

Only `acorn`.

-----

## Screenshots:

1 - Original JS file, provided to scribe as an argument.

2 - The main GUI, which lists all functions/classes in the file that would benefit from being documented.

3 - The "See full" button opens a pop-up window that shows the exact context of the function or class.

4 - Example inputs.

5 - The "Done" button located at the bottom of the page will process the current inputs.

6 - The automatically downloaded file upon clicking "Done".

7 - The final result. Scribe has added documentation to your function/class, respecting its position and indentation.

![](https://i.imgur.com/SWvLpfH.png)
