import gulp from 'gulp';
import babel from 'gulp-babel';
import chmod from 'gulp-chmod';
import eslint from 'gulp-eslint';
import esdoc from 'gulp-esdoc';

gulp.task('doc', () => gulp.src("./src")
  .pipe(esdoc({ destination: "./docs" })));

gulp.task('lint', () =>  gulp.src('src/**/*.js')
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError()));

gulp.task('build', () => gulp.src('src/**/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-2'],
    plugins: ['add-module-exports']
  }))
  .pipe(chmod({
    owner: {
      read: true,
      write: true,
      execute: true
    },
    group: {
      execute: true
    },
    others: {
      execute: true
    }
  }))
  .pipe(gulp.dest('dist')));
