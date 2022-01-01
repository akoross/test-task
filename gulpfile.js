import gulp from "gulp";
const { src, dest, watch, parallel, series } = gulp;
import fs from "fs";
import browser_sync from "browser-sync";
const sync = browser_sync;
import del from "del";
import autoprefixer from "gulp-autoprefixer";
import clean_css from "gulp-clean-css";
import file_include from "gulp-file-include";
import fonter from "gulp-fonter";
import media_queries from "gulp-group-css-media-queries";
import imagemin from "gulp-imagemin";
import rename from "gulp-rename";
import sass_galp from "gulp-sass";
import sass_dart from "sass";
const sass = sass_galp(sass_dart);
import svg_sprite from "gulp-svg-sprite";
import ttf2woff from "gulp-ttf2woff";
import ttf2woff2 from "gulp-ttf2woff2";
import uglify_es from "gulp-uglify-es";
const uglify = uglify_es.default;
import webp from "gulp-webp";
import webp_html from "gulp-webp-html";
import webp_css from "gulp-webpcss";

const project_folder = "dist";
const source_folder = "#src";

const path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    pug: [source_folder + "/*.pug", "!" + source_folder + "/**/_*.pug"],
    css: source_folder + "/scss/style.scss",
    js: [source_folder + "/js/**/*.js", "!" + source_folder + "/js/**/_*.js"],
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    pug: source_folder + "/**/*.pug",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/",
};

export const server = () => {
  sync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    cors: true,
    notify: false,
    ui: false,
  });
};

const fonts = () => {
  src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(sync.stream());
};

export const html = () => {
  return src(path.src.html)
    .pipe(file_include())
    .pipe(webp_html())
    .pipe(dest(path.build.html))
    .pipe(sync.stream());
};

const reloadHTML = (done) => {
  sync.reload();
  done();
};

const js = () => {
  return src(path.src.js)
    .pipe(uglify())
    .pipe(dest(path.build.js))
    .pipe(sync.stream());
};

export const css = () => {
  return src(path.src.css)
    .pipe(
      sass({
        outputStyle: "expanded",
      })
    )
    .pipe(media_queries())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 version"],
        cascade: true,
      })
    )
    .pipe(webp_css())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(sync.stream());
};

export const images = () => {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progresive: true,
        svgPlugins: [
          {
            removeViewBox: false,
          },
        ],
        interlased: true,
        optimizationLevel: 3, // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(sync.stream());
};

gulp.task("otf2ttf", function () {
  return src([source_folder + "/fonts/*.otf"])
    .pipe(
      fonter({
        formats: ["ttf"],
      })
    )
    .pipe(dest(source_folder + "/fonts/"));
});

gulp.task("svg_sprite", function () {
  return gulp
    .src([source_folder + "/iconsprite/*.svg"])
    .pipe(
      svg_sprite({
        mode: {
          stack: {
            sprite: "../icons/icons.svg",
            example: true,
          },
        },
      })
    )
    .pipe(dest(path.build.img));
});

gulp.task("fontsStyle", () => {
  let file_content = fs.readFileSync(source_folder + "/scss/fonts.scss");
  if (file_content == "") {
    fs.writeFile(source_folder + "/scss/fonts.scss", "", () => {});
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split(".");
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(
              source_folder + "/scss/fonts.scss",
              '@include font("' +
                fontname +
                '", "' +
                fontname +
                '", "400", "normal");\r\n',
              () => {}
            );
          }
          c_fontname = fontname;
        }
      }
    });
  }
});

export const watchFiles = () => {
  watch([path.watch.css], series(css));
  watch([path.watch.js], series(js));
  watch([path.watch.img], images);
  watch([path.watch.html], series(html, reloadHTML));
};

export const clean = () => {
  return del(path.clean);
};

export const build = series(clean, parallel(css, html, js, images, fonts));
export default series(build, parallel(watchFiles, server));
