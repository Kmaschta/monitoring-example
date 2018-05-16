const express = require('express');
const prometheusClient = require('prom-client');

const app = express();
const defaultMetricsCollection = prometheusClient.collectDefaultMetrics();

const successCounter = new prometheusClient.Counter({
    name: 'app_success_count',
    help: 'APP total success counter',
});

const errorCounter = new prometheusClient.Counter({
    name: 'app_error_count',
    help: 'APP total error counter',
});

app.get('/200', (req, res) => {
    successCounter.inc();
    res.send('OK');
});

app.get('/500', (req, res) => {
    errorCounter.inc();
    res.status(500).send('KO');
});

app.get('/metrics', (req, res) => {
    res.send(prometheusClient.register.metrics());
});

const server = app.listen(4000, () => {
    console.log('Web server listening on port 4000.');
});

const gracefulShutdown = () => {
    console.warn('Shutting down gracefully...');

    server.close(() => {
        clearInterval(defaultMetricsCollection);
        prometheusClient.register.clear();
        process.exit();
    });

    setTimeout(() => {
        console.error('Could not close connections in time. Forcefully shutdown.');
        process.exit(1);
    }, 5000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
