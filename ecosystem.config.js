module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'Xien5',
            script: './bin/www',
            source_map_support: false,
            out_file: "./log/xien5_out.log",
            error_file: "./log/xien5_errror.log",
            watch: false,
            env: {
                COMMON_VARIABLE: 'true',
                PORT: 80,
                NODE_ENV: 'production',
                SITE_URL: 'http://xien5.com'
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 80,
                SITE_URL: 'http://xien5.com'
            }
        },

        // Cron site
        {
            name: 'Cron',
            script: './cronjob/index.js',
            watch: false,
            out_file: "./log/crawl_out.log",
            error_file: "./log/crawl_error.log",
            env: {
                COMMON_VARIABLE: 'true',
                PORT: 80,
                NODE_ENV: 'production',
                SITE_URL: 'http://xien5.com'
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 80,
                SITE_URL: 'http://xien5.com'
            }
        },
    ],
    deploy: {
        production: {
            user: 'root',
            host: ['45.77.8.127'],
            ref: 'origin/master',
            repo: 'git@github.com:dangtienngoc/xien5-api.git',
            path: '/root/web',
            'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
        }
    }
};