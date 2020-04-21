export default () => process.env.NODE_ENV === 'production' ? 'http://loose.dev/api' : 'http://alpha.loose.dev/api'
