module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        /* A baixo é realizado a configuração do plugin grunt-contrib-less
        Este plugin e o grunt ligado ao less */
        less: {
            /* E preciso adicionar a palavra development porque podemos estar criando configurações
            diferentes a partir dp ambiente aonde o grunt é executado. */
            development: { // development é um ambiente de desenvolvimento pode se chamar também de ambiente local
                files: {
                    /*dist de destribuição
quando o arquivo for executado na vercel a pasta dist fara com que
vercel faça a leitura dos arquivos que estara dentro da pasta dist*/"dev/styles/main.css" : "src/styles/main.less"
                }
            },
            production: { //production é um ambiente de produção que é desenvolvido para o lado do consumidor produção
                options: {
                    compress: true,
                },
                files: {
                    "dist/styles/main.min.css" : "src/styles/main.less"
                }
            }
        },
        watch: {
            /*no less vamos colocar o nom e da tarefa */less: {
                files: ["src/styles/**/*.less"], // |** sinal para selecionar todos os arquivos que estiverem dentro da pasta |   *sinal para selecionar todos os arquivos
                tasks: ["less:development"]
            },
            html: {
                files: ["src/index.html"],
                tasks: ["replace:dev"]
            }
        },
        replace: {
            dev: {
                options: {
                    patterns: [
                        {
                            match: "ENDERECO_DO_CSS",
                            replacement: "./styles/main.css"
                        },
                        {
                            match: "ENDERECO_DO_JS",
                            replacement: "../src/scripts/main.js"
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ["src/index.html"],
                        dest: "dev/"
                    }
                ]
            },
            dist: {
                options: {
                    patterns: [
                        {
                            match: "ENDERECO_DO_CSS",
                            replacement: "./styles/main.min.css"
                        },
                        {
                            match: "ENDERECO_DO_JS",
                            replacement: "./scripts/main.min.js"
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ["prebuild/index.html"],
                        dest: "dist/"
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    /*1 - minificao*/ "prebuild/index.html" : "src/index.html"
                    /*2 - substituicao*/
                }
            }
        },
        clean: ["prebuild"],
        uglify: {
            target: {
                files: {
                    "dist/scripts/main.min.js" : "src/scripts/main.js"
                }
            }
        }
    })
    /* grunt.loadNpmTasks("grunt-contrib-less"); é referente ao carregamento
    do plugin grunt-contrib-less */
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-replace");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    /* A baixo foi criado uma tarefa default assim não será mais preciso executar o comando
    npm run grunt olaGrunt que seria o nome da nossa função. com o defaut basta nos 
    executarmos npm run grunt que a nossa tarefa será executada. */
    grunt.registerTask("default", ["watch"]);
    /* A task build que na tradução seria contruir é um termo que nos usamos para publicar a nossa
    aplicação, no ambiente produtivo como por exemplo na vercel */
    grunt.registerTask("build", ["less:production", "htmlmin:dist", "replace:dist", "clean", "uglify"]);

}