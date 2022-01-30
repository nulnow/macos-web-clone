# Mac OS Web clone

## TODO
* When resizing apps based on iframe there is a bug that mouse enters
another document and leaves current so resizing ends. The possible solution
is to track if window is resizing and create an overlay above the iframe with
`pointer-events: none;` so mouse events can pass through the iframe and hit
the original document
