This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

### `npm install`

Installs all dependencies:

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Possible improvements that I would make if I continued

FE:
1) Add SCSS support + css-namespace library (to beautify CSS classes and make them more readable)
2) Make more use of Boostrap layout and styling.
3) Make configurable columns in the table
4) Add a column that would match colors in the Chart with process names in the table
5) Add more metrics on "Simple view" (open questions is what to use as a value on Y axis) OR create more views - whichever is simpler.
6) Make polling interval configurable (this seems to not be possible with standard lib and will require some async work on backend)
7) Make the Chart-related code more generic and strict.
8) Improve the way the "tooltips" are shown
9) Play with Chart animations - Highcharts are really powerful and deserve more respect :)

BE: 
1) Use another lib to grab system processes. Possibly more configurable and convenient.

Bonus: think how to override white scroll on a table with dark theme on it - it's really ugly now :)

## Activity time tracking (both FE and BE tracking is here)

FE - initial project setup (React + Typescript + github repo) - 1.5h
	- added new websocket lib to the UI
	- implemented polling for processes (Spring scheduler) - 1h
	- added bootstrap table - 1h
    - polished data fetching, added dark theme to chart, minor improvements - 3h
    - implemented filtering and sorting for the table, updated layout, cleaned up things - 4h
    - added sortingDescriptor, added server-side provided timestamps for X axes, minor updates - 1.5h
    - implemented "simple view" for graph, it's possible to switch now, fixed a lot of array processing errors - 3h
    - implemented informational tooltips, "lastTick" feature, improved UX, polished code - 3h 

BE - initial project setup (Spring boot + JProcess + github repo) - 1h 
   - Spring websocket initial setup - 2h
   - implemented process fetching - 1h
   - implemented tracked process list and kill feature - 3h 
   - cleaned up unused methods and improved project structure - 0.5h
   - added server-side provided timestamps for X axes - 0.5h
   - added overall CPU usage stat into info batch - 1h
   - played with various logic on "tracked" and "non-tracked" processes. Decided to stay with all processes to be displayed - 3h
   - minor improvements - 1h