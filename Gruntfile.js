module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            build: 'client/build'
        },

        uglify: {
            build: {
                files: {
                    'client/build/js/build.js': [
                        'client/src/js/app.js',
                        'client/src/js/controllers.js',
                        'client/src/js/services.js',
                        'client/src/js/config/config.js'
                    ]
                }
            }
        },

        sass: {
            build: {
                options: {
                    style: 'compressed'
                },

                files: {
                    'client/build/css/main.css': 'client/src/css/main.scss'
                }
            }
        },

        targethtml: {
            build: {
                files: {
                    'client/build/index.html': 'client/src/index.html'
                }
            }
        },

        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'client/src/',
                    src: 'partials/**',
                    dest: 'client/build/'
                }]
            }
        },

        watch: {
            files: ['**/*.scss'],
            tasks: ['sass']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-targethtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['clean', 'uglify', 'sass', 'targethtml', 'copy']);
};
