# Mac OS Web clone

## TODO
* When resizing apps based on `iframe` there is a bug that mouse enters
another document and leaves current so resizing ends. The possible solution
is to track if window is resizing and create an overlay above the iframe with
`pointer-events: none;` so mouse events can pass through the iframe and hit
the original document
* When enters `fullscreen` on `iframe based` apps the app size stays the same; app
does not exit `fullscreen` mode if use press `Escape` button
* Fix styles on `Windows OS`
* Filesystem
* Desktop icons

