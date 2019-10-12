export default function Logger(props) {
    if (process.env.NODE_ENV != 'production'){
        console.log(props)
    }
}