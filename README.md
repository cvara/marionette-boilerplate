# Marionette Boilerplate Project

This is a sample project to be used as a starting point for new Marionette based projects. The architecture, directory structure and libraries used reflect my personal mindset and workflow and are not -by any means- intended to be used as "best practices".

The workflow relies on the following tools & libraries:

* Marionette
* Webpack
* Gulp
* Bootsrap (the LESS source code)

### Getting started

The project requires [Node.js](http://nodejs.org/download/) `>=0.10.26` and the [npm](https://www.npmjs.org/) of the appropriate version.
Note that some nodejs PPA repositories for Ubuntu (e.g. the [Chris Lea's PPA](http://www.ubuntuupdates.org/ppa/chris_lea_nodejs))
inlude the npm along with the actual nodejs packages.

Once Node.js and npm are installed, install [Gulp](http://gulpjs.com/) globally,
by running `npm install --global gulp`.

Lastly, clone the project, `cd` to it, and `npm install` all project dependencies.


### Running & building the project

There are several Gulp tasks that allow running & building of the project, each designed for a different environment.

As of now, these are the most useful tasks:

* `gulp sandbox`: Runs development server, without live reload

* `gulp run`: The default task, builds runs the project in dev mode (**uncompressed** webpack chunks & **livereload**)

* `gulp runProd`: Builds project for production (**compressed** webpack chunks)


### Cleaning npm cache

The node package manager maintains a cache where recently downloaded packages are stored. Cleaning the cache with `npm clean cache` from time to time may solve weird problems caused by some grunt tasks (e.g. grunt-contrib-imagemin).


### Linting Javascript

Linting Javascript files before commiting prevents various issues and ensures consistency. Linting is performed automatically by all custom Grunt tasks described above, however linting the project manually is also advised.
Linting is easy with [JSHint](http://jshint.com/) over Node.js. To install jshint `npm install -g jshint`. As a bonus, jshint works well with [SublimeLinter3](https://github.com/SublimeLinter/SublimeLinter3) & the [SublimeLinter-jshint](https://github.com/SublimeLinter/SublimeLinter-jshint) plugin.
