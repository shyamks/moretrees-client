export default function Logger() {
    if (process.env.NODE_ENV != 'production'){
        console.log(arguments)
    }
}