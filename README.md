# Marionette Bootstrap Project

This is a sample project to be used as a starting point for new Marionette based projects. The architecture, directory structure and libraries used reflect my personal mindset and workflow and are not -by any means- intended to be used as "best practices".

The workflow relies on the following tools & libraries:

* Underscore
* jQuery
* Backbone
* Marionette
* RequireJS
* Grunt
* Bootsrap (the LESS source code)

### Getting started

The project requires [Node.js](http://nodejs.org/download/) `>=0.10.26` and the [npm](https://www.npmjs.org/) of the appropriate version.
Note that some nodejs PPA repositories for Ubuntu (e.g. the [Chris Lea's PPA](http://www.ubuntuupdates.org/ppa/chris_lea_nodejs))
inlude the npm along with the actual nodejs packages.

Once Node.js and npm are installed, install [Grunt](http://gruntjs.com/) Command Line Interface (CLI) globally,
by running `npm install -g grunt-cli` with administrative rights (sudo for Ubuntu).

Now that the environment is ready, clone the project to a folder of your choice, `cd` to that folder and run `npm install` to fetch and install all project dependencies.


### Running & building the project

There are several Grunt tasks that allow running & building of the project, each designed for a different environment.

As of now, these are the most useful tasks:


* `grunt`:The default task, runs the project in dev mode with logs

* `grunt build-all`:Builds project for production. Minifies and bundles resources, compiles less into css, leaves out static data used for testing, removes logs and compresses images

* `grunt prod-run`:Builds project as above & starts connect server


* `grunt debug-run`:Builds & runs project in debug mode. Resources are bundled through r.js, but are unminified and logging is on


### Cleaning npm cache

The node package manager maintains a cache where recently downloaded packages are stored. Cleaning the cache with `npm clean cache` from time to time may solve weird problems caused by some grunt tasks (e.g. grunt-contrib-imagemin).


### Linting Javascript

Linting Javascript files before commiting prevents various issues and ensures consistency. Linting is performed automatically by all custom Grunt tasks described above, however linting the project manually is also advised.
Linting is easy with [JSHint](http://jshint.com/) over Node.js. To install jshint `npm install -g jshint`. As a bonus, jshint works well with [SublimeLinter3](https://github.com/SublimeLinter/SublimeLinter3) & the [SublimeLinter-jshint](https://github.com/SublimeLinter/SublimeLinter-jshint) plugin.


---

Authored by [Christoforos Varakliotis](http://gr.linkedin.com/in/christoforosvarakliotis/)