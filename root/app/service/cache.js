const redis = require("redis")
const { promisify } = require("util");

const REDIS_DOCKER_HOST_NAME = process.env.REDIS_DOCKER_HOST_NAME

const rdb = redis.createClient({
    port      : 6379,              
    host      : REDIS_DOCKER_HOST_NAME,        
});

// The redis lib is callback based so we need to make it promise
const getAsync = promisify(rdb.get).bind(rdb);
const setAsync = promisify(rdb.set).bind(rdb);

exports.createCache = async (key, data) => {
    let payload = JSON.stringify(data);
    const result = await setAsync(key, payload)
    return result
}

exports.getCache = async (key) => {
    const result = await getAsync(key);
    return result
}