export default function Logger(props) {
    if (process.env.NODE_ENV == 'development'){
        console.log(props)
    }
}