const Home = ({ name }) => {
    return (
        <h1 id='center'>
            Welcome, {name ? name : 'Please login to explore...'}
        </h1>
    )
}

export default Home
