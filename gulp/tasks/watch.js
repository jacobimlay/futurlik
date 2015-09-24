var gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch('./content/stylesheets/scss/**/!(_all).scss', ['scss']);
  gulp.watch('./craft/templates/**/**.twig', ['browser-reload'])
});