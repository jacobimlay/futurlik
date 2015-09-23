/*////////////////////////////////////////////////////
------------------------------------------------------
                                           
                             ,dPYb,            
                             IP'`Yb            
                             I8  8I            
                             I8  8'            
       ,gggg,gg  gg      gg  I8 dP  gg,gggg,   
      dP"  "Y8I  I8      8I  I8dP   I8P"  "Yb  
     i8'    ,8I  I8,    ,8I  I8P    I8'    ,8i 
    ,d8,   ,d8I ,d8b,  ,d8b,,d8b,_ ,I8 _  ,d8' 
    P"Y8888P"8888P'"Y88P"`Y88P'"Y88PI8 YY88888P
           ,d8I'                    I8         
         ,dP'8I                     I8         
        ,8"  8I                     I8         
        I8   8I                     I8         
        `8, ,8I                     I8         
         `Y8P"                      I8         


                     GULP CONFIG    

------------------------------------------------------

  PROJECT: PROJECTNAME
  WEBSITE:
  AUTHOR: RABBLE + ROUSER
 
------------------------------------------------------
////////////////////////////////////////////////////*/

var gulp = require('gulp');

/*////////////////////////////////////////////////////
                    GULP REQUIRES                    
////////////////////////////////////////////////////*/

var fs = require('fs');
var glob = require('glob');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var browserSync = require('browser-sync');
var merge = require('merge-stream');


/*////////////////////////////////////////////////////
                    PROJECT INFO                  
////////////////////////////////////////////////////*/

var projectName = 'Project Name';
// DEV URL
var devURL = 'local.playground.dev';

/*////////////////////////////////////////////////////
                       PATHS                  
////////////////////////////////////////////////////*/

var neat = require('node-neat').includePaths;
var cwd = __dirname;
var paths = {
    includes: ['./content/stylesheets/scss'].concat(neat),
    scss: './content/stylesheets/scss/*.scss',
    css: cwd + '/content/stylesheets/css/',
    svg: './content/images/svg',
    images: './content/images'  
};

/*////////////////////////////////////////////////////
                       TASKS                  
////////////////////////////////////////////////////*/

/*-------------------------
   Browser-sync 
   ------------------------ */
   var reload = browserSync.reload;

   gulp.task('browser-sync', function() {
    browserSync({
        browser: ["google chrome", "firefox", "safari"],
        proxy: devURL
    });
  });

/*-------------------------
   GLOBBING SCSS
------------------------ */
gulp.task('scss-includes', function (callback) {
  var all = '_all.scss';
  glob('./content/stylesheets/scss/**/' + all, function (error, files) {
    files.forEach(function (allFile) {
      // Add a banner to warn users
      fs.writeFileSync(allFile, '/** This is a dynamically generated file **/\n\n');

      var directory = path.dirname(allFile);
      var partials = fs.readdirSync(directory).filter(function (file) {
        return (
          // Exclude the dynamically generated file
          file !== all &&
          // Only include _*.scss files
          path.basename(file).substring(0, 1) === '_' &&
          path.extname(file) === '.scss'
        );
      });
      // Append import statements for each partial
      partials.forEach(function (partial) {
        fs.appendFileSync(allFile, '@import "' + partial + '";\n');
      });
    });
  });
  callback();
});

/*-------------------------
   SCSS
------------------------ */
gulp.task('scss', ['scss-includes'], function () {
gulp.src(paths.scss, { cwd: cwd })
  .pipe(sourcemaps.init())
  .pipe(sass({includePaths: paths.includes}))   // Compile SCSS Include neat
  .pipe(sourcemaps.write())                     // Write Sourcemaps
  .pipe(plumber.stop())
  .pipe(gulp.dest(paths.css))                   // Save CSS file                            
  .pipe(reload({stream:true}));                 // Reload browsers
});

/*///////////////////////////////////////////////////
                     WATCH TASK                     
///////////////////////////////////////////////////*/

gulp.task('watch', function() {
  gulp.watch('./content/stylesheets/scss/**/!(_all).scss', ['scss']);
});

/*///////////////////////////////////////////////////
                    DEFAULT TASK                    
///////////////////////////////////////////////////*/

gulp.task('default', ['browser-sync', 'scss', 'watch']);