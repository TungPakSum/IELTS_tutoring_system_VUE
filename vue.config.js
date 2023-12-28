// eslint-disable-next-line no-undef
const {defineConfig} = require('@vue/cli-service')
// eslint-disable-next-line no-undef
module.exports = defineConfig({
        transpileDependencies: true,
        lintOnSave: false,
        devServer: {
            proxy: {
                '^/api/.*': {
                    target: 'http://localhost:3000'
                },

        
            }
        }
    }
)

