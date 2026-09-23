# monitor-resolution

A lightweight client-side utility that displays the current monitor resolution and related display diagnostics for the page being loaded.

## Overview

The page shows the screen size in pixels as:
> width[px] × height[px]

It also reports additional values such as the available screen area, browser viewport, device pixel ratio, aspect ratio, orientation, and total screen pixels.

### Access

The page has been [deployed with GitHub Pages](https://alexmadrinanfdez.github.io/monitor-resolution/). You can also download and open the project locally with your choice of browser.

## Features

| Feature | Description | Example |
| --- | --- | --- |
| Screen size | The current monitor resolution in pixels. | 1920 × 1080 px |
| Available screen | The usable screen space after browser and operating system UI is accounted for. | 1920 × 1040 px |
| Browser viewport | The current size of the browser window content area. | 1440 × 900 px |
| Device pixel ratio | The scale between CSS pixels and physical device pixels. | 1 |
| Aspect ratio | The resolution reduced to its simplest integer ratio. | 16:9 |
| Orientation | Whether the display is landscape or portrait. | Landscape |
| Total screen pixels | The full pixel count of the screen. | 2,073,600 px |

## Project structure

- `index.html`: page layout and display diagnostics table.
- `diagnostics.js`: logic for reading the browser and screen metrics and rendering the values.
- `style.css`: styling for the page and the resolution display.

This project is a static browser page and does not require a build step or package installation.
