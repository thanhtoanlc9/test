module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [

        // First application
        {
            name: 'Xien5',
            script: './xien5-api/bin/www',
            source_map_support: false,
            out_file: "./xien5-api/log/xien5_out.log",
            error_file: "./xien5-api/log/xien5_errror.log",
            watch: true,
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
            script: './xien5-api/cronjob/index.js',
            watch: true,
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
};