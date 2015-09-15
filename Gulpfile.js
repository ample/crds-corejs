var gulp = require('gulp');
var watch = require('gulp-watch');
var gutil = require('gulp-util');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var svgSprite = require('gulp-svg-sprite');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var argv = require('yargs').argv;
var npm = require('npm');
var fs = require('fs');
var bump = require('gulp-bump');
var git = require('gulp-git');

var browserSyncCompiles = 0;
var browserSync = require('browser-sync').create();

// Start the development server
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], function() {
	gulp.watch(webpackConfig, ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['webpack:build']);

gulp.task('bump', function () {
  var rType = argv.releaseType;

  if (!rType) {
    rType = 'patch'; 
  }

  return gulp.src(['./package.json'])
    .pipe(bump({type:rType}))
    .pipe(gulp.dest('./'));
});

gulp.task('versionAndPublish', ['bump', 'npmPublish', 'tag']);

gulp.task('tag', function(){
  var branch = argv.branch;
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  if (!branch) {
    var error = new Error('Branch is required as an argument --branch development');
    throw error;
  }
  return gulp.src('./')
    .pipe(git.commit(message, {args: '-a'}))
    .pipe(git.tag(v, message, function(err){
      if(err) { throw err; } 
    }))
    .pipe(git.push('origin', branch, {args: '--tags'}), function(err){
      if(err) { throw err; } 
    })
    .pipe(gulp.dest('./'));
});

gulp.task('npmPublish', function(callback) {
  var username = argv.username;
  var password = argv.password;
  var email = argv.email;
  var type = argv.releaseType;

  if (!username) {
      var usernameError = new Error('Username is required as an argument --username exampleUsername');
      return callback(usernameError);
  }
  if (!password) {
      var passwordError = new Error('Password is required as an argument --password  examplepassword');
      return callback(passwordError);
  }
  if (!email) {
      var emailError = new Error('Email is required as an argument --email example@email.com');
      return callback(emailError);
  }
  if (!type) {
    type = 'patch';
  }

  var uri = 'http://registry.npmjs.org/';
  npm.load(null, function (loadError) {
    if (loadError) {
      return callback(loadError);
    }
    var auth = {
      username: username,
      password: password,
      email: email,
      alwaysAuth: true
    };
    var addUserParams = {
      auth: auth
    };
    npm.registry.adduser(uri, addUserParams, function (addUserError, data, raw, res) {
      if (addUserError) {
        return callback(addUserError);
      }
      var metadata = require('./package.json');
      metadata = JSON.parse(JSON.stringify(metadata));
      npm.commands.pack([], function (packError) {
        if (packError) {
          return callback(packError);
        }
        var fileName = metadata.name + '-' + metadata.version + '.tgz';
        var bodyPath = require.resolve('./' + fileName);
        var body = fs.createReadStream(bodyPath);
        var publishParams = {
            metadata: metadata,
            access: 'public',
            body: body,
            auth: auth
        };

        if (type === 'prerelease') {
          publishParams.tag = metadata.version; 
        }
        npm.registry.publish(uri, publishParams, function (publishError, resp) {
          if (publishError) {
            return callback(publishError);
          }
          console.log('Publish succesful: ' + JSON.stringify(resp));
          return callback();
        });
      });
    });
  }); 

});

// For convenience, an "alias" to webpack-dev-server
gulp.task("start", ["webpack-dev-server"]);

// Run the development server
gulp.task("webpack-dev-server", ["icons-watch"], function(callback) {
  // Modify some webpack config options
  webpackConfig.devtool = "eval";
  webpackConfig.debug = true;
  webpackConfig.output.path = "/";
  // Build app to assets - watch for changes
  gulp.src("app/**/**")
    .pipe(watch(webpackConfig.watchPattern))
    .pipe(gulpWebpack(webpackConfig))
    .pipe(gulp.dest("./assets"));

	new WebpackDevServer(webpack(webpackConfig), {
			publicPath: "/assets/",
			quiet: false,
			watchOptions: {
        aggregrateTimeout: 300
      },
			stats: {
				colors: true
			}
		}).listen(8080, "localhost", function(err) {
      if(err) throw new gutil.PluginError("webpack-dev-server", err);
      gutil.log("[start]", "http://localhost:8080/webpack-dev-server/index.html");
    });

	gutil.log("[start]", "Access crossroads.net at http://localhost:8080/#");
	gutil.log("[start]", "Access crossroads.net Live Reload at http://localhost:8080/webpack-dev-server/#");
});

gulp.task("webpack:build", ["icons"], function(callback) {
  // modify some webpack config options
  webpackConfig.plugins = webpackConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }), new webpack.optimize.DedupePlugin());

	// run webpack
	webpack(webpackConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
    callback();
  });
});

gulp.task("webpack:build-dev", ["icons"], function(callback) {
  // modify some webpack config options
  webpackConfig.devtool = "sourcemap";
  webpackConfig.debug = true;

	// run webpack
	webpack(webpackConfig).run(function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build-dev", err);
		gutil.log("[webpack:build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// Watches for svg icon changes - run "icons" once, then watch
gulp.task("icons-watch", ["icons"], function() {
	gulp.watch("app/icons/*.svg", ["icons"]);
});

// Builds sprites and previews for svg icons
gulp.task("icons", ["svg-sprite"], function() {
    gulp.src('build/icons/generated/defs/sprite.defs.html')
	  .pipe(rename("preview-svg.html"))
      .pipe(gulp.dest('./assets'));

    gulp.src('build/icons/generated/defs/svg/sprite.defs.svg').pipe(rename("cr.svg")).pipe(gulp.dest('./assets'));
});


gulp.task("svg-sprite", function() {
	var config = {
		log: "info",
		mode: {
			defs: {
				prefix: ".icon-%s",
				example: {
					template: __dirname + "/config/sprite.template.html",
				},
				inline: true,
				bust: false
			}
		}
	};

	return gulp.src("./app/icons/*.svg")
		.pipe(svgSprite(config))
		.pipe(gulp.dest("./build/icons/generated"));
});
